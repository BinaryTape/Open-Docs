[//]: # (title: コンテキストパラメーター)

<primary-label ref="experimental-general"/>

> コンテキストパラメーターは、[コンテキストレシーバー](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)と呼ばれる古い実験的な機能に置き換わるものです。
> それらの主な違いは、[コンテキストパラメーターの設計ドキュメント](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)で確認できます。
> コンテキストレシーバーからコンテキストパラメーターに移行するには、関連する[ブログ記事](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)で説明されているように、IntelliJ IDEAのアシストサポートを使用できます。
>
{style="tip"}

コンテキストパラメーターを使用すると、関数とプロパティは、周囲のコンテキストで暗黙的に利用可能な依存関係を宣言できます。

コンテキストパラメーターを使用すると、サービスや依存関係など、共有されており、一連の関数呼び出し全体でほとんど変更されない値を手動で渡す必要がなくなります。

プロパティや関数にコンテキストパラメーターを宣言するには、`context`キーワードの後にパラメーターのリストを続けます。各パラメーターは`name: Type`として宣言されます。`UserService`インターフェースへの依存関係を持つ例を次に示します。

```kotlin
// UserServiceはコンテキストで必要な依存関係を定義します
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// コンテキストパラメーターを持つ関数を宣言します
context(users: UserService)
fun outputMessage(message: String) {
    // コンテキストからlogを使用します
    users.log("Log: $message")
}

// コンテキストパラメーターを持つプロパティを宣言します
context(users: UserService)
val firstUser: String
    // コンテキストからfindUserByIdを使用します    
    get() = users.findUserById(1)
```

`_`をコンテキストパラメーター名として使用できます。この場合、パラメーターの値は解決のために利用可能ですが、ブロック内で名前でアクセスすることはできません。

```kotlin
// "_"をコンテキストパラメーター名として使用します
context(_: UserService)
fun logWelcome() {
    // 解決はUserServiceから適切なlog関数を引き続き見つけます
    outputMessage("Welcome!")
}
```

#### コンテキストパラメーターの解決

Kotlinは、現在のスコープで一致するコンテキスト値を検索することにより、呼び出しサイトでコンテキストパラメーターを解決します。Kotlinは型によってそれらを一致させます。
同じスコープレベルで複数の互換性のある値が存在する場合、コンパイラは曖昧さを報告します。

```kotlin
// UserServiceはコンテキストで必要な依存関係を定義します
interface UserService {
    fun log(message: String)
}

// コンテキストパラメーターを持つ関数を宣言します
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // UserServiceを実装します
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // UserServiceを実装します
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // serviceAとserviceBの両方が呼び出しサイトで期待されるUserService型に一致します
    context(serviceA, serviceB) {
        // これは曖昧さエラーを引き起こします
        outputMessage("This will not compile")
    }
}
```

#### 制限

コンテキストパラメーターは継続的に改善されており、現在のいくつかの制限は次のとおりです。

*   コンストラクターはコンテキストパラメーターを宣言できません。
*   コンテキストパラメーターを持つプロパティはバッキングフィールドや初期化子を持つことができません。
*   コンテキストパラメーターを持つプロパティは委譲を使用できません。

これらの制限にもかかわらず、コンテキストパラメーターは、簡素化された依存性注入、改善されたDSL設計、およびスコープ操作を通じて、依存関係の管理を簡素化します。

#### コンテキストパラメーターを有効にする方法

プロジェクトでコンテキストパラメーターを有効にするには、コマンドラインで次のコンパイラオプションを使用します。

```Bash
-Xcontext-parameters
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> `-Xcontext-receivers`と`-Xcontext-parameters`の両方のコンパイラオプションを同時に指定するとエラーになります。
>
{style="warning"}

この機能は、将来のKotlinリリースで[安定化](components-stability.md#stability-levels-explained)され、改善される予定です。
課題追跡システム[YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)で皆様からのフィードバックをお待ちしております。