import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// SUZURI商品検索ツール
export const suzuriSearchTool = createTool({
  id: "suzuri-search",
  description: "SUZURIで商品を検索します。キーワードを入力すると関連する商品を返します。",
  inputSchema: z.object({
    keyword: z.string().describe("検索キーワード（例：猫、花柄、かわいい）"),
    limit: z.number().optional().default(10).describe("取得する商品数"),
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      id: z.number(),
      title: z.string(),
      imageUrl: z.string(),
      price: z.number(),
      itemType: z.string(),
      url: z.string(),
    })),
    totalCount: z.number(),
  }),
  execute: async ({ context }) => {
    const { keyword, limit = 10 } = context;

    try {
      // SUZURI公開API（認証不要）で商品検索
      const response = await fetch(
        `https://suzuri.jp/api/v1/products/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // フォールバック：キーワードマッチングで擬似検索結果を返す
        return {
          products: [],
          totalCount: 0,
        };
      }

      const data = await response.json();

      const products = (data.products || []).map((product: any) => ({
        id: product.id,
        title: product.title || product.material?.title || '無題',
        imageUrl: product.sampleImageUrl || product.imageUrl || '',
        price: product.price || 0,
        itemType: product.item?.name || 'アイテム',
        url: `https://suzuri.jp/products/${product.id}`,
      }));

      return {
        products,
        totalCount: data.meta?.totalCount || products.length,
      };
    } catch (error) {
      console.error('SUZURI search error:', error);
      return {
        products: [],
        totalCount: 0,
      };
    }
  },
});

// キーワード連想ツール
export const keywordSuggestionTool = createTool({
  id: "keyword-suggestion",
  description: "ユーザーの要望から検索キーワードを連想・提案します。",
  inputSchema: z.object({
    userRequest: z.string().describe("ユーザーのリクエスト（例：夏らしいTシャツが欲しい）"),
  }),
  outputSchema: z.object({
    keywords: z.array(z.string()).describe("連想されたキーワードのリスト"),
  }),
  execute: async ({ context }) => {
    const { userRequest } = context;

    // シンプルなキーワード連想マップ
    const keywordMap: Record<string, string[]> = {
      '夏': ['サマー', '海', '太陽', 'ひまわり', 'かき氷', 'スイカ'],
      '冬': ['雪', 'クリスマス', '雪だるま', 'セーター', 'もこもこ'],
      '春': ['桜', '花', '新生活', 'パステル', '蝶々'],
      '秋': ['紅葉', 'もみじ', 'ハロウィン', 'かぼちゃ', '食欲'],
      '猫': ['ねこ', 'にゃんこ', 'キャット', '肉球', 'ネコ'],
      '犬': ['いぬ', 'わんこ', 'ドッグ', '柴犬', 'イヌ'],
      'かわいい': ['キュート', 'ゆるい', 'ほのぼの', 'ファンシー', 'ポップ'],
      'おもしろい': ['ネタ', 'ユーモア', 'ギャグ', 'シュール', '変'],
      'シンプル': ['ミニマル', 'モノトーン', '無地', 'ベーシック'],
    };

    const keywords: string[] = [];

    // ユーザーのリクエストからキーワードを抽出
    for (const [key, values] of Object.entries(keywordMap)) {
      if (userRequest.includes(key)) {
        keywords.push(key, ...values);
      }
    }

    // キーワードが見つからない場合は元のリクエストから単語を抽出
    if (keywords.length === 0) {
      const words = userRequest.split(/[\s、,。！!？?]+/).filter(w => w.length > 1);
      keywords.push(...words);
    }

    return {
      keywords: [...new Set(keywords)].slice(0, 5), // 重複除去して最大5件
    };
  },
});
