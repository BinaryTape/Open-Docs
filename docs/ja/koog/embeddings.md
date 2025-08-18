# 埋め込み

`embeddings` モジュールは、テキストとコードの埋め込みを生成・比較する機能を提供します。埋め込みは、セマンティックな意味合いを捉えるベクトル表現であり、効率的な類似性比較を可能にします。

## 概要

このモジュールは、主に以下の2つのコンポーネントで構成されています。

1.  **embeddings-base**: 埋め込みのコアインターフェースとデータ構造。
2.  **embeddings-llm**: ローカル埋め込み生成のためのOllamaを使用した実装。

## はじめに

以下のセクションでは、埋め込みを以下の方法で使用するための基本的な例をいくつか紹介します。

-   Ollamaを介したローカル埋め込みモデルの使用
-   OpenAI埋め込みモデルの使用

### ローカル埋め込み

ローカルモデルで埋め込み機能を使用するには、システムにOllamaがインストールされ、実行されている必要があります。
インストールと実行の手順については、[公式Ollama GitHubリポジトリ](https://github.com/ollama/ollama)を参照してください。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        // OllamaClientインスタンスを作成
        val client = OllamaClient()
        // エンベッダーを作成
        val embedder = LLMEmbedder(client, OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
        // 埋め込みを作成
        val embedding = embedder.embed("This is the text to embed")
        // 埋め込みを出力
        println(embedding)
    }
}
```
<!--- KNIT example-embeddings-01.kt -->

Ollama埋め込みモデルを使用するには、以下の前提条件を満たしていることを確認してください。

-   [Ollama](https://ollama.com/download)がインストールされ、実行されていること
-   以下のコマンドを使用して、埋め込みモデルをローカルマシンにダウンロードすること:
    ```bash
    ollama pull <ollama-model-id>
    ```
    `<ollama-model-id>` を特定のモデルのOllama識別子に置き換えてください。利用可能な埋め込みモデルとその識別子に関する詳細については、「[Ollamaモデルの概要](#ollama-models-overview)」を参照してください。

### Ollamaモデルの概要

以下の表は、利用可能なOllama埋め込みモデルの概要を示しています。

| モデルID          | Ollama ID         | パラメーター | 次元 | コンテキスト長 | パフォーマンス                                                           | トレードオフ                                                          |
|-------------------|-------------------|------------|------------|----------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| NOMIC_EMBED_TEXT  | nomic-embed-text  | 137M       | 768        | 8192           | セマンティック検索やテキスト類似性タスク向けの高品質な埋め込み          | 品質と効率のバランスが取れている                                        |
| ALL_MINILM        | all-minilm        | 33M        | 384        | 512            | 一般的なテキスト埋め込みに良好な品質で高速な推論                      | モデルサイズは小さいが、コンテキスト長は短く、非常に効率的                 |
| MULTILINGUAL_E5   | zylonai/multilingual-e5-large   | 300M       | 768        | 512            | 100以上の言語で強力なパフォーマンス                                     | モデルサイズは大きいが、優れた多言語機能を提供                           |
| BGE_LARGE         | bge-large         | 335M       | 1024       | 512            | 英語テキスト検索やセマンティック検索に優れている                        | モデルサイズは大きいが、高品質な埋め込みを提供                           |
| MXBAI_EMBED_LARGE | mxbai-embed-large | -          | -          | -              | テキストデータの高次元埋め込み                                          | 高次元埋め込みの作成用に設計されている                                  |

これらのモデルに関する詳細については、Ollamaの[Embedding Models](https://ollama.com/blog/embedding-models)ブログ記事を参照してください。

### モデルの選択

ここでは、要件に応じてどのOllama埋め込みモデルを選択すべきかに関する一般的なヒントをいくつか紹介します。

-   一般的なテキスト埋め込みには、`NOMIC_EMBED_TEXT` を使用します。
-   多言語サポートには、`MULTILINGUAL_E5` を使用します。
-   最高の品質（パフォーマンスを犠牲にする）には、`BGE_LARGE` を使用します。
-   最高の効率（品質を多少犠牲にする）には、`ALL_MINILM` を使用します。
-   高次元の埋め込みには、`MXBAI_EMBED_LARGE` を使用します。

## OpenAI埋め込み

OpenAI埋め込みモデルを使用して埋め込みを作成するには、以下の例に示すように、`OpenAILLMClient` インスタンスの `embed` メソッドを使用します。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
suspend fun openAIEmbed(text: String) {
    // OPENAI_KEY環境変数からOpenAI APIトークンを取得
    val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")
    // OpenAILLMClientインスタンスを作成
    val client = OpenAILLMClient(token)
    // エンベッダーを作成
    val embedder = LLMEmbedder(client, OpenAIModels.Embeddings.TextEmbeddingAda002)
    // 埋め込みを作成
    val embedding = embedder.embed(text)
    // 埋め込みを出力
    println(embedding)
}
```
<!--- KNIT example-embeddings-02.kt -->

## 例

以下の例は、埋め込みを使用してコードとテキスト、または他のコードスニペットを比較する方法を示しています。

### コードとテキストの比較

コードスニペットを自然言語の説明と比較して、意味的な一致を見つけます。

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToText(embedder: Embedder) { // Embedder型
    // コードスニペット
    val code = """
        fun factorial(n: Int): Int {
            return if (n <= 1) 1 else n * factorial(n - 1)
        }
    """.trimIndent()

    // テキストの説明
    val description1 = "A recursive function that calculates the factorial of a number"
    val description2 = "A function that sorts an array of integers"

    // 埋め込みを生成
    val codeEmbedding = embedder.embed(code)
    val desc1Embedding = embedder.embed(description1)
    val desc2Embedding = embedder.embed(description2)

    // 差を計算（値が小さいほど類似性が高い）
    val diff1 = embedder.diff(codeEmbedding, desc1Embedding)
    val diff2 = embedder.diff(codeEmbedding, desc2Embedding)

    println("Difference between code and description 1: $diff1")
    println("Difference between code and description 2: $diff2")

    // コードはdescription2よりもdescription1に似ているはずです。
    if (diff1 < diff2) {
        println("The code is more similar to: '$description1'")
    } else {
        println("The code is more similar to: '$description2'")
    }
}
```
<!--- KNIT example-embeddings-03.kt -->

### コードとコードの比較

構文の違いにかかわらず、コードスニペットを比較して意味的な類似性を見つけます。

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
-->
```kotlin
suspend fun compareCodeToCode(embedder: Embedder) { // Embedder型
    // 異なる言語で同じアルゴリズムの2つの実装
    val kotlinCode = """
        fun fibonacci(n: Int): Int {
            return if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
        }
    """.trimIndent()

    val pythonCode = """
        def fibonacci(n):
            if n <= 1:
                return n
            else:
                return fibonacci(n-1) + fibonacci(n-2)
    """.trimIndent()

    val javaCode = """
        public static int bubbleSort(int[] arr) {
            int n = arr.length;
            for (int i = 0; i < n-1; i++) {
                for (int j = 0; j < n-i-1; j++) {
                    if (arr[j] > arr[j+1]) {
                        int temp = arr[j];
                        arr[j] = arr[j+1];
                        arr[j+1] = temp;
                    }
                }
            }
            return arr;
        }
    """.trimIndent()

    // 埋め込みを生成
    val kotlinEmbedding = embedder.embed(kotlinCode)
    val pythonEmbedding = embedder.embed(pythonCode)
    val javaEmbedding = embedder.embed(javaCode)

    // 差を計算
    val diffKotlinPython = embedder.diff(kotlinEmbedding, pythonEmbedding)
    val diffKotlinJava = embedder.diff(kotlinEmbedding, javaEmbedding)

    println("Difference between Kotlin and Python implementations: $diffKotlinPython")
    println("Difference between Kotlin and Java implementations: $diffKotlinJava")

    // KotlinとPythonの実装の方がより類似しているはずです。
    if (diffKotlinPython < diffKotlinJava) {
        println("The Kotlin code is more similar to the Python code")
    } else {
        println("The Kotlin code is more similar to the Java code")
    }
}
```
<!--- KNIT example-embeddings-04.kt -->

## APIドキュメント

埋め込みに関連する完全なAPIリファレンスについては、以下のモジュールのリファレンスドキュメントを参照してください。

-   [embeddings-base](https://api.koog.ai/embeddings/embeddings-base/ai.koog.embeddings.base/index.html): テキストとコードの埋め込みを表現し、比較するためのコアインターフェースとデータ構造を提供します。
-   [embeddings-llm](https://api.koog.ai/embeddings/embeddings-llm/index.html): ローカル埋め込みモデルを扱うための実装が含まれています。