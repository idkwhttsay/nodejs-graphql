import DataLoader from 'dataloader';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';

export default class Loader {
    readonly member: DataLoader<string, MemberType | undefined>;
    readonly user: DataLoader<string, User | undefined>;
    readonly subscribed: DataLoader<string, User[] | undefined>;
    readonly subscribers: DataLoader<string, User[] | undefined>;
    readonly post: DataLoader<string, Post | undefined>;
    readonly userPosts: DataLoader<string, Post[] | undefined>;
    readonly profile: DataLoader<string, Profile | undefined>;
    readonly userProfile: DataLoader<string, Profile | undefined>;

    constructor(db: PrismaClient) {
        this.member = new DataLoader(async (keys) => {
            const result = await db.memberType.findMany({
                where: { id: { in: keys as string[] } },
            });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.user = new DataLoader(async (keys) => {
            const result = await db.user.findMany({
                where: { id: { in: keys as string[] } },
            });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.subscribed = new DataLoader(async (keys) => {
            const result = await db.subscribersOnAuthors.findMany({
                where: { subscriberId: { in: keys as string[] } },
                select: { author: true, subscriberId: true },
            });
            return keys.map((key) =>
                result
                    .filter((sub) => key === sub.subscriberId)
                    .map((sub) => {
                        this.user.prime(sub.author.id, sub.author);
                        return sub.author;
                    }),
            );
        });
        this.subscribers = new DataLoader(async (keys) => {
            const result = await db.subscribersOnAuthors.findMany({
                where: { authorId: { in: keys as string[] } },
                select: { subscriber: true, authorId: true },
            });
            return keys.map((key) =>
                result
                    .filter((sub) => key === sub.authorId)
                    .map((sub) => {
                        this.user.prime(sub.subscriber.id, sub.subscriber);
                        return sub.subscriber;
                    }),
            );
        });
        this.post = new DataLoader(async (keys) => {
            const result = await db.post.findMany({
                where: { id: { in: keys as string[] } },
            });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.userPosts = new DataLoader(async (keys) => {
            const res = await db.post.findMany({
                where: { authorId: { in: keys as string[] } },
            });
            return keys.map((id) => res.filter((post) => id === post.authorId));
        });
        this.profile = new DataLoader(async (keys) => {
            const result = await db.profile.findMany({
                where: { id: { in: keys as string[] } },
            });
            return keys.map((k) => result.find((v) => k === v.id));
        });
        this.userProfile = new DataLoader(async (keys) => {
            const res = await db.profile.findMany({
                where: { userId: { in: keys as string[] } },
            });
            return keys.map((id) => res.find((post) => id === post.userId));
        });
    }
}
