[//]: # (title: コンテキストパラメータ)

<primary-label ref="experimental-general"/>

> コンテキストパラメータ（Context parameters）は、[コンテキストレシーバー](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)と呼ばれていた古い試験的機能を置き換えるものです。
> 主な違いについては、[コンテキストパラメータのデザインドキュメント](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)（英語）で確認できます。
> コンテキストレシーバーからコンテキストパラメータへの移行については、関連する[ブログ記事](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)で説明されているように、IntelliJ IDEAのアシスト機能を使用できます。
>
{style="tip"}

コンテキストパラメータを使用すると、関数やプロパティが、周囲のコンテキストで暗黙的に利用可能な依存関係を宣言できるようになります。

コンテキストパラメータを使用すれば、一連の関数呼び出しの間で共有され、めったに変更されないサービスや依存関係などの値を、手動で渡し続ける必要がなくなります。

プロパティや関数に対してコンテキストパラメータを宣言するには、`context` キーワードに続けて、`name: Type` 形式で宣言されたパラメータのリストを使用します。以下は、`UserService` インターフェースへの依存関係を持つ例です。

```kotlin
// UserService はコンテキストで必要とされる依存関係を定義します
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// コンテキストパラメータを持つ関数を宣言します
context(users: UserService)
fun outputMessage(message: String) {
    // コンテキストの users から log を使用します
    users.log("Log: $message")
}

// コンテキストパラメータを持つプロパティを宣言します
context(users: UserService)
val firstUser: String
    // コンテキストの users から findUserById を使用します    
    get() = users.findUserById(1)
```

コンテキストパラメータ名として `_` を使用することもできます。この場合、パラメータの値は解決（resolution）には利用可能ですが、ブロック内で名前を使ってアクセスすることはできません。

```kotlin
// コンテキストパラメータ名として "_" を使用します
context(_: UserService)
fun logWelcome() {
    // 解決プロセスにより、UserService から適切な log 関数が引き続き見つけられます
    outputMessage("Welcome!")
}
```

#### コンテキストパラメータの解決

Kotlinは、現在のスコープ内で一致するコンテキスト値を検索することで、呼び出し側（call site）でコンテキストパラメータを解決します。Kotlinはそれらを型によって照合します。
同じスコープ階層に複数の互換性のある値が存在する場合、コンパイラは曖昧さ（ambiguity）エラーを報告します。

```kotlin
// UserService はコンテキストで必要とされる依存関係を定義します
interface UserService {
    fun log(message: String)
}

// コンテキストパラメータを持つ関数を宣言します
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // UserService を実装します 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // UserService を実装します
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // 呼び出し側で、serviceA と serviceB の両方が期待される UserService 型に一致します
    context(serviceA, serviceB) {
        // これは曖昧さエラーになります
        outputMessage("This will not compile")
    }
}
```

#### 制限事項

コンテキストパラメータは継続的に改善が行われており、現在の制限事項には以下のものが含まれます：

* コンストラクタにはコンテキストパラメータを宣言できません。
* コンテキストパラメータを持つプロパティは、バッキングフィールド（backing field）や初期化子（initializer）を持つことができません。
* コンテキストパラメータを持つプロパティは、委譲（delegation）を使用できません。

これらの制限はありますが、コンテキストパラメータは依存関係注入の簡略化、DSL設計の向上、およびスコープ限定の操作を通じて、依存関係の管理を簡素化します。

#### コンテキストパラメータを有効にする方法

プロジェクトでコンテキストパラメータを有効にするには、コマンドラインで以下のコンパイラオプションを使用します：

```Bash
-Xcontext-parameters
```

または、Gradleビルドファイルの `compilerOptions {}` ブロックに追加します：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> `-Xcontext-receivers` と `-Xcontext-parameters` の両方のコンパイラオプションを同時に指定すると、エラーが発生します。
>
{style="warning"}

この機能は、将来のKotlinリリースで[安定化](components-stability.md#stability-levels-explained)され、改善される予定です。
フィードバックがある場合は、課題トラッカー [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) までお寄せください。