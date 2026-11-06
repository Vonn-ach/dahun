import { act, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';
import { staticSource, testBundle } from '../test/content';
import {
  ContentProvider,
  createContentStore,
  createCourse,
  localize,
  useContentChannel,
  useCourse,
  useCurrentCourse,
  type Bundle,
  type ContentSource,
  type Course,
} from '.';

describe('createCourse', () => {
  const course = createCourse(testBundle);

  it('looks up entries, units and lessons by id', () => {
    expect(course.code).toBe('tst');
    expect(course.getEntry('tst-0002')?.gloss.en).toBe('river');
    expect(course.getUnit('more')?.lessons).toHaveLength(1);
    expect(course.getLesson('basics-1')?.introduce).toEqual(['tst-0001', 'tst-0002', 'tst-0003']);
    expect(course.unitOfEntry('tst-0005')?.id).toBe('more');
    expect(course.getDialect('shared')?.selectable).toBe(false);
    expect(course.getSource('test-notes')?.title).toBe('Test field notes');
    expect(course.hasLessons).toBe(true);
  });

  it('returns undefined for ids that are not in the bundle', () => {
    expect(course.getEntry('tst-9999')).toBeUndefined();
    expect(course.getLesson('nope')).toBeUndefined();
    expect(course.getSentence('tst-s001')).toBeUndefined();
  });

  it('has no lessons when the bundle has no units', () => {
    expect(createCourse({ ...testBundle, units: [] }).hasLessons).toBe(false);
  });
});

describe('createContentStore', () => {
  it('returns the same promise for the same language, and loads it once', async () => {
    let loads = 0;
    const source: ContentSource = {
      channel: 'draft',
      languages: [],
      load: () => {
        loads += 1;
        return Promise.resolve(testBundle);
      },
    };
    const store = createContentStore(source);
    const first = store.course('tst');
    expect(store.course('tst')).toBe(first);
    expect((await first).code).toBe('tst');
    expect(loads).toBe(1);
  });

  it('forgets a failed load so it can be retried', async () => {
    let fail = true;
    const store = createContentStore({
      channel: 'draft',
      languages: [],
      load: () => (fail ? Promise.reject(new Error('offline')) : Promise.resolve(testBundle)),
    });
    await expect(store.course('tst')).rejects.toThrow('offline');
    fail = false;
    await expect(store.course('tst')).resolves.toMatchObject({ code: 'tst' });
  });
});

function Label({ course }: { course: Course | undefined }) {
  const channel = useContentChannel();
  return <p>{`${course ? localize(course.bundle.name, 'ms') : 'none'} (${channel})`}</p>;
}

function CourseName({ code }: { code: string }) {
  return <Label course={useCourse(code)} />;
}

function CurrentCourseName() {
  return <Label course={useCurrentCourse()} />;
}

describe('content hooks', () => {
  it('renders a bundle that is already in memory without suspending', () => {
    render(
      <ContentProvider source={staticSource([testBundle], 'release')}>
        <CurrentCourseName />
      </ContentProvider>,
    );
    expect(screen.getByText('Bahasa Ujian (release)')).toBeInTheDocument();
  });

  it('suspends while a bundle loads', async () => {
    let finishLoading: (bundle: Bundle) => void = () => undefined;
    const loaded = new Promise<Bundle>((resolve) => {
      finishLoading = resolve;
    });
    const source: ContentSource = { channel: 'draft', languages: [], load: () => loaded };
    // In a test environment React retries a suspended render only inside an async act().
    await act(async () => {
      render(
        <ContentProvider source={source}>
          <Suspense fallback={<p>{'loading'}</p>}>
            <CourseName code="tst" />
          </Suspense>
        </ContentProvider>,
      );
    });
    expect(screen.getByText('loading')).toBeInTheDocument();
    await act(async () => {
      finishLoading(testBundle);
    });
    expect(screen.getByText('Bahasa Ujian (draft)')).toBeInTheDocument();
  });

  it('has no current course when the build has no languages', () => {
    render(
      <ContentProvider source={staticSource([])}>
        <CurrentCourseName />
      </ContentProvider>,
    );
    expect(screen.getByText('none (draft)')).toBeInTheDocument();
  });
});
