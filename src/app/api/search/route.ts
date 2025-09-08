import { type NextRequest, NextResponse } from "next/server";
import { elasticClient } from "@/configs/elasticsearch";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('q')?.trim();

        if (!query) {
            return NextResponse.json({
                error: "Query parameter 'q' is required."
            }, { status: 400 });
        }

        const esResult = await elasticClient.search({
            index: 'savoury-index',
            size: 10,
            query: {
                multi_match: {
                    query: query,
                    fields: ["title^3", "description", "category", "ingredients.ingredient_name"],
                    fuzziness: 'AUTO'
                }
            }
        });

        const hits = esResult.hits?.hits?.map(hit => ({
            id: hit._id,
            ...(hit._source as Record<string, any>),
        })) ?? [];

        return NextResponse.json({
            results: hits,
            total: typeof esResult.hits?.total === 'object' ? esResult.hits.total.value : esResult.hits?.total ?? 0
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/search GET error: ${error}`
        }, { status: 500 });
    }
}