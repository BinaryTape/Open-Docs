[//]: # (title: 可読性)

読みやすいAPIを作成するには、単にクリーンなコードを書くだけ以上のことが求められます。統合と使用を簡素化する、思慮深い設計が必要です。このセクションでは、コンポーザビリティを考慮したライブラリの構造化、簡潔で表現力豊かなセットアップのためのドメイン固有言語（DSLs）の活用、そして明確で保守しやすいコードのための拡張関数とプロパティの使用によって、APIの可読性を向上させる方法を探ります。

## 明示的なコンポーザビリティを優先する

ライブラリは、カスタマイズを可能にする高度なオペレーターをしばしば提供します。例えば、ある操作では、ユーザーが独自のデータ構造、ネットワークチャネル、タイマー、またはライフサイクルオブザーバーを提供することを許可する場合があります。しかし、これらのカスタマイズオプションを追加の関数パラメーターを通じて導入すると、APIの複雑性が大幅に増す可能性があります。

カスタマイズのためにより多くのパラメーターを追加する代わりに、異なる振る舞いを組み合わせられるAPIを設計する方がより効果的です。例えば、コルーチンのFlows APIでは、[バッファリング](flow.md#buffering)と[コンフレーション](flow.md#conflation)の両方が個別の関数として実装されています。これらは、各基本操作がバッファリングとコンフレーションを制御するためのパラメーターを受け入れる代わりに、[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html)や[`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html)のようなより基本的な操作と連鎖させることができます。

もう一つの例は、[Jetpack ComposeのModifiers API](https://developer.android.com/develop/ui/compose/modifiers)です。これにより、コンポーザブルコンポーネントは、パディング、サイズ、背景色などの一般的なカスタマイズオプションを処理する単一の`Modifier`パラメーターを受け入れることができます。このアプローチは、各Composableがこれらのカスタマイズのために個別のパラメーターを受け入れる必要をなくし、APIを効率化し、複雑性を低減します。

```kotlin
Box(
    modifier = Modifier
        .padding(10.dp)
        .onClick { println("Box clicked!") }
        .fillMaxWidth()
        .fillMaxHeight()
        .verticalScroll(rememberScrollState())
        .horizontalScroll(rememberScrollState())
) {
    // Box content goes here
}
```

## DSLsを使用する

Kotlinライブラリは、ビルダーDSLを提供することで可読性を大幅に向上させることができます。DSLを使用すると、ドメイン固有のデータ宣言を簡潔に繰り返すことができます。例えば、Ktorベースのサーバーアプリケーションの以下のサンプルを考えてみましょう。

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    routing {
        post("/article") {
            call.respond<String>(HttpStatusCode.Created, ...)
        }
        get("/article/list") {
            call.respond<List<CreateArticle>>(...)
        }
        get("/article/{id}") {
            call.respond<Article>(...)
        }
    }
}
```

これは、Jsonシリアライゼーションを使用するように構成された`ContentNegotiation`プラグインをインストールし、アプリケーションが様々な`/article`エンドポイントへのリクエストに応答するようにルーティングを設定します。

DSLの作成に関する詳細な説明については、[タイプセーフビルダー](type-safe-builders.md)を参照してください。ライブラリを作成する文脈において、以下の点に注意する価値があります。

*   DSLで使用される関数はビルダー関数であり、最後のパラメーターとしてレシーバー付きラムダを取ります。この設計により、これらの関数は括弧なしで呼び出すことができ、構文がより明確になります。渡されるラムダは、作成されるエンティティを構成するために使用できます。上記の例では、`routing`関数に渡されるラムダがルーティングの詳細を構成するために使用されています。
*   クラスのインスタンスを作成するファクトリ関数は、戻り型と同じ名前を持ち、大文字で始まるべきです。これは、上記のサンプルで`Json`インスタンスの作成で確認できます。これらの関数は、設定のためにラムダパラメーターを取ることもできます。詳細については、[コーディング規約](coding-conventions.md#function-names)を参照してください。
*   ビルダー関数に提供されるラムダ内で必須のプロパティがコンパイル時に設定されていることを保証できないため、必須の値を関数パラメーターとして渡すことをお勧めします。

DSLを使用してオブジェクトを構築することは、可読性を向上させるだけでなく、後方互換性も改善し、ドキュメント作成プロセスを簡素化します。例えば、以下の関数を考えてみましょう。

```kotlin
fun Json(prettyPrint: Boolean, isLenient: Boolean): Json
```

この関数は`Json{}` DSLビルダーの代わりになり得ます。しかし、DSLアプローチには顕著な利点があります。

*   DSLビルダーを使用すると、この関数を使用するよりも後方互換性を維持しやすくなります。新しい設定オプションを追加することは、単に新しいプロパティ（または他の例では新しい関数）を追加することを意味し、既存の関数のパラメーターリストを変更するのとは異なり、後方互換性のある変更だからです。
*   また、ドキュメントの作成と維持も容易になります。関数の多くのパラメーターをすべて一箇所で記述する必要がある代わりに、各プロパティをその宣言箇所で個別に記述できます。

## 拡張関数とプロパティを使用する

可読性を向上させるために、[拡張関数とプロパティ](extensions.md)を使用することをお勧めします。

クラスとインターフェースは、型のコアコンセプトを定義すべきです。追加の機能と情報は、拡張関数とプロパティとして記述されるべきです。これにより、読者に対して、追加機能がコアコンセプトの上に実装できること、そして追加情報が型内のデータから計算できることが明確になります。

例えば、[`CharSequence`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-sequence/)型（`String`も実装しています）は、その内容にアクセスするための最も基本的な情報とオペレーターのみを含んでいます。

```kotlin
interface CharSequence {
    val length: Int
    operator fun get(index: Int): Char
    fun subSequence(startIndex: Int, endIndex: Int): CharSequence
}
```

文字列に一般的に関連付けられる機能は、ほとんどが拡張関数として定義されており、これらはすべて型のコアコンセプトと基本的なAPIの上で実装できます。

```kotlin
inline fun CharSequence.isEmpty(): Boolean = length == 0
inline fun CharSequence.isNotEmpty(): Boolean = length > 0

inline fun CharSequence.trimStart(predicate: (Char) -> Boolean): CharSequence {
    for (index in this.indices)
        if (!predicate(this[index]))
           return subSequence(index, length)
    return ""
}
```

算出プロパティと通常のメソッドは拡張として宣言することを検討してください。通常のプロパティ、オーバーライド、およびオーバーロードされたオペレーターのみが、デフォルトでメンバーとして宣言されるべきです。

## 引数としてブール型を使用することを避ける

以下の関数を考えてみましょう。

```kotlin
fun doWork(optimizeForSpeed: Boolean) { ... }
```

この関数をAPIで提供する場合、次のように呼び出すことができます。

```kotlin
doWork(true)
doWork(optimizeForSpeed=true)
```

最初の呼び出しでは、パラメーター名ヒントが有効になっているIDEでコードを読んでいない限り、ブール引数が何のためのものかを推測することは不可能です。名前付き引数を使用すると意図は明確になりますが、ユーザーにこのスタイルを採用させる方法はありません。したがって、可読性を向上させるために、コードでブール型を引数として使用すべきではありません。

代わりに、APIはブール引数によって制御されるタスク専用の別の関数を作成できます。この関数は、その機能を示す記述的な名前を持つべきです。

例えば、[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/)インターフェースには以下の拡張機能があります。

```kotlin
fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R>
fun <T, R : Any> Iterable<T>.mapNotNull(
    transform: (T) -> R?
): List<R>
```

単一のメソッドの代わりに:

```kotlin
fun <T, R> Iterable<T>.map(
    includeNullResults: Boolean = true, 
    transform: (T) -> R
): List<R>
```

もう一つの良いアプローチは、異なる操作モードを定義するために`enum`クラスを使用することです。このアプローチは、複数の操作モードがある場合や、これらのモードが時間とともに変更されると予想される場合に役立ちます。

## 数値型を適切に使用する

Kotlinは、APIの一部として使用できる一連の数値型を定義しています。それらを適切に使用する方法を以下に示します。

*   `Int`、`Long`、`Double`型を算術型として使用します。これらは計算が実行される値を表します。
*   算術型を非算術的なエンティティに使用することは避けてください。例えば、IDを`Long`として表現すると、ユーザーはIDが順序どおりに割り当てられているという仮定でIDを比較しようとするかもしれません。これは、信頼できない、または無意味な結果につながったり、警告なしに変更される可能性のある実装に依存関係を生じさせたりする可能性があります。より良い戦略は、ID抽象化のための特殊なクラスを定義することです。パフォーマンスに影響を与えることなくそのような抽象化を構築するために、[インライン値クラス](inline-classes.md)を使用できます。例として、[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスを参照してください。
*   `Byte`、`Float`、`Short`型はメモリレイアウト型です。これらは、キャッシュ内やネットワーク経由でデータを送信する際など、値を保存するために利用できるメモリ量を制限するために使用されます。これらの型は、基になるデータがその型内に確実に収まり、計算が不要な場合にのみ使用すべきです。
*   符号なし整数型である`UByte`、`UShort`、`UInt`、`ULong`は、指定された形式で利用可能な正の数値の全範囲を利用するために使用すべきです。これらは、符号付き型の範囲を超える値が必要なシナリオや、ネイティブライブラリとの相互運用に適しています。ただし、ドメインが[非負の整数](unsigned-integer-types.md#non-goals)のみを必要とする状況での使用は避けてください。

## 次のステップ

ガイドの次のパートでは、一貫性について学びます。

[次のパートへ進む](api-guidelines-consistency.md)