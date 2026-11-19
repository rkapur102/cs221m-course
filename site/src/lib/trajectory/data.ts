import raw from './trajectories.json';

export type Vec3 = [number, number, number];
export type Emotion = 'anger' | 'disgust' | 'fear' | 'happiness' | 'sadness' | 'surprise';

export interface Cloud {
	points: Vec3[];
	emotion: Emotion[];
}

export interface Story {
	id: string;
	points: Vec3[];
}

export const cloud: Cloud = {
	points: raw.cloud.points as Vec3[],
	emotion: raw.cloud.emotion as Emotion[]
};

const stories = raw.stories as unknown as Record<string, Vec3[]>;

export const storyIds: string[] = Object.keys(stories);

export function getStory(id: string): Story {
	const points = stories[id];
	if (!points) throw new Error(`Unknown story id: ${id}`);
	return { id, points };
}
