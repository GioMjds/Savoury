import { httpClient } from "@/configs/axios";

class FeedService {
    async fetchFeed() {
        return httpClient.get("/feed");
    }
}

export const feed = new FeedService();