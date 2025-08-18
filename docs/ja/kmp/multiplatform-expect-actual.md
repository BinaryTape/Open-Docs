[//]: # (title: Expected と Actual 宣言)

Expected と Actual 宣言を使用すると、Kotlin Multiplatform モジュールからプラットフォーム固有の API にアクセスできます。共通コードでプラットフォームに依存しない API を提供できます。

> この記事では、Expected と Actual 宣言の言語メカニズムについて説明します。プラットフォーム固有の API を使用するさまざまな方法に関する一般的な推奨事項については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md)を参照してください。
>
{style="tip"}

## Expected と Actual 宣言のルール

Expected と Actual 宣言を定義するには、次のルールに従います。

1.  共通ソースセットで、標準の Kotlin 構成要素を宣言します。これは、関数、プロパティ、クラス、インターフェース、列挙型、またはアノテーションです。
2.  この構成要素に `expect` キーワードを付けます。これが _expected宣言_ です。これらの宣言は共通コードで使用できますが、実装を含めるべきではありません。代わりに、プラットフォーム固有のコードがこの実装を提供します。
3.  各プラットフォーム固有のソースセットで、同じパッケージ内に同じ構成要素を宣言し、`actual` キーワードを付けます。これが _actual宣言_ であり、通常、プラットフォーム固有のライブラリを使用した実装が含まれます。

特定のターゲット向けにコンパイルする際、コンパイラは、見つけた各 _actual_ 宣言を共通コード内の対応する _expected_ 宣言と照合しようとします。コンパイラは次のことを保証します。

*   共通ソースセット内のすべての expected宣言が、すべてのプラットフォーム固有ソースセットに対応する actual宣言を持つこと。
*   expected宣言が実装を含まないこと。
*   すべての actual宣言が、対応する expected宣言と同じパッケージ (例: `org.mygroup.myapp.MyType`) を共有すること。

異なるプラットフォーム向けの最終コードを生成する際、Kotlin コンパイラは互いに対応する expected と actual 宣言をマージします。各プラットフォームに対して、実際の__実装を持つ 1 つの宣言を生成します。共通コード内の expected宣言のすべての使用は、結果として得られるプラットフォームコード内の正しい actual宣言を呼び出します。

異なるターゲットプラットフォーム間で共有される中間ソースセットを使用する場合に、actual宣言を宣言できます。例えば、`iosX64Main`、`iosArm64Main`、`iosSimulatorArm64Main` のプラットフォームソースセット間で共有される中間ソースセットとして `iosMain` を考えてみましょう。通常、`iosMain` のみが actual宣言を含み、プラットフォームソースセットは含みません。Kotlin コンパイラは、これらの actual宣言を使用して、対応するプラットフォーム向けの最終コードを生成します。

IDE は、次のような一般的な問題に役立ちます。

*   宣言の欠落
*   実装を含む expected宣言
*   宣言シグネチャの不一致
*   異なるパッケージ内の宣言

IDE を使用して、expected宣言から actual宣言へ移動することもできます。ガターアイコンを選択して actual宣言を表示するか、[ショートカット](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)を使用してください。

![IDE navigation from expected to actual declarations](expect-actual-gutter.png){width=500}

## Expected と Actual 宣言を使用するさまざまなアプローチ

expect/actual メカニズムを使用して、プラットフォーム API にアクセスしながら共通コードでそれらを操作する方法を提供するという問題を解決するためのさまざまなオプションを見てみましょう。

ユーザーのログイン名と現在のプロセス ID を含む `Identity` 型を実装する必要がある Kotlin Multiplatform プロジェクトを考えてみましょう。このプロジェクトには、JVM と iOS のようなネイティブ環境でアプリケーションを動作させるために、`commonMain`、`jvmMain`、`nativeMain` のソースセットがあります。

### Expected と Actual 関数

`Identity` 型とファクトリ関数 `buildIdentity()` を定義できます。これは共通ソースセットで宣言され、プラットフォームソースセットで異なる方法で実装されます。

1.  `commonMain` で、シンプルな型を宣言し、ファクトリ関数を expectします。

    ```kotlin
    package identity

    class Identity(val userName: String, val processID: Long)
    
    expect fun buildIdentity(): Identity
    ```

2.  `jvmMain` ソースセットで、標準の Java ライブラリを使用してソリューションを実装します。

    ```kotlin
    package identity
    
    import java.lang.System
    import java.lang.ProcessHandle

    actual fun buildIdentity() = Identity(
        System.getProperty("user.name") ?: "None",
        ProcessHandle.current().pid()
    )
    ```

3.  `nativeMain` ソースセットで、ネイティブ依存関係を使用して [POSIX](https://en.wikipedia.org/wiki/POSIX) を使用したソリューションを実装します。

    ```kotlin
    package identity
    
    import kotlinx.cinterop.toKString
    import platform.posix.getlogin
    import platform.posix.getpid

    actual fun buildIdentity() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
    ```

    ここでは、プラットフォーム関数がプラットフォーム固有の `Identity` インスタンスを返します。

> Kotlin 1.9.0 以降、`getlogin()` および `getpid()` 関数を使用するには `@OptIn` アノテーションが必要です。
>
{style="note"}

### Expected と Actual 関数を持つインターフェース

ファクトリ関数が大きくなりすぎる場合は、共通の `Identity` インターフェースを使用し、異なるプラットフォームで異なる方法で実装することを検討してください。

`buildIdentity()` ファクトリ関数は `Identity` を返すべきですが、今回は共通インターフェースを実装するオブジェクトです。

1.  `commonMain` で、`Identity` インターフェースと `buildIdentity()` ファクトリ関数を定義します。

    ```kotlin
    // In the commonMain source set:
    expect fun buildIdentity(): Identity
    
    interface Identity {
        val userName: String
        val processID: Long
    }
    ```

2.  Expected と Actual 宣言を_追加で使用せず_に、インターフェースのプラットフォーム固有の実装を作成します。

    ```kotlin
    // In the jvmMain source set:
    actual fun buildIdentity(): Identity = JVMIdentity()

    class JVMIdentity(
        override val userName: String = System.getProperty("user.name") ?: "none",
        override val processID: Long = ProcessHandle.current().pid()
    ) : Identity
    ```

    ```kotlin
    // In the nativeMain source set:
    actual fun buildIdentity(): Identity = NativeIdentity()
    
    class NativeIdentity(
        override val userName: String = getlogin()?.toKString() ?: "None",
        override val processID: Long = getpid().toLong()
    ) : Identity
    ```

これらのプラットフォーム関数は、`JVMIdentity` および `NativeIdentity` プラットフォーム型として実装された、プラットフォーム固有の `Identity` インスタンスを返します。

#### Expected と Actual プロパティ

前の例を変更して、`Identity` を保存する `val` プロパティを expectできます。

このプロパティを `expect val` としてマークし、プラットフォームソースセットで actual化します。

```kotlin
//In commonMain source set:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//In jvmMain source set:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//In nativeMain source set:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### Expected と Actual オブジェクト

`IdentityBuilder` が各プラットフォームでシングルトンとして期待される場合、それを expectedオブジェクトとして定義し、プラットフォームに actual化させることができます。

```kotlin
// In the commonMain source set:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// In the jvmMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// In the nativeMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 依存性注入に関する推奨事項

疎結合アーキテクチャを作成するために、多くの Kotlin プロジェクトが依存性注入（DI）フレームワークを採用しています。DI フレームワークを使用すると、現在の環境に基づいてコンポーネントに依存関係を注入できます。

たとえば、テスト時と本番環境、またはクラウドにデプロイする場合とローカルでホストする場合で、異なる依存関係を注入できます。依存関係がインターフェースを介して表現されている限り、コンパイル時または実行時に任意の数の異なる実装を注入できます。

同じ原則が、依存関係がプラットフォーム固有の場合にも適用されます。共通コードでは、コンポーネントは通常の [Kotlin インターフェース](https://kotlinlang.org/docs/interfaces.html)を使用して依存関係を表現できます。DI フレームワークは、JVM や iOS モジュールなど、プラットフォーム固有の実装を注入するように構成できます。

これは、expected と actual 宣言が DI フレームワークの構成にのみ必要であることを意味します。例については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md#dependency-injection-framework)を参照してください。

このアプローチにより、インターフェースとファクトリ関数を使用するだけで Kotlin Multiplatform を採用できます。プロジェクトで依存関係を管理するためにすでに DI フレームワークを使用している場合は、プラットフォームの依存関係を管理するためにも同じアプローチを使用することをお勧めします。

### Expected と Actual クラス

> Expected と Actual クラスは[ベータ版](supported-platforms.md#general-kotlin-stability-levels)です。これらはほぼ安定していますが、将来的に移行手順が必要になる場合があります。私たちは、皆様が行うべきさらなる変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

Expected と Actual クラスを使用して、同じソリューションを実装できます。

```kotlin
// In the commonMain source set:
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// In the jvmMain source set:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// In the nativeMain source set:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

このアプローチは、デモンストレーション資料ですでに見たことがあるかもしれません。ただし、インターフェースで十分な簡単なケースでクラスを使用することは_推奨されません_。

インターフェースを使用すると、ターゲットプラットフォームごとに 1 つの実装に設計を制限することはありません。また、テストでフェイク実装を代替したり、単一プラットフォームで複数の実装を提供したりすることがはるかに簡単になります。

一般的なルールとして、可能な限り標準の言語構成要素に頼り、expected と actual 宣言の使用は避けてください。

expected と actual クラスを使用することを決定した場合、Kotlin コンパイラは機能のベータ状態について警告を発します。この警告を抑制するには、Gradle ビルドファイルに次のコンパイラオプションを追加します。

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### プラットフォームクラスからの継承

クラスで `expect` キーワードを使用するのが最善のアプローチとなる特殊なケースがあります。`Identity` 型が JVM にすでに存在するとします。

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

既存のコードベースとフレームワークに適合させるために、`Identity` 型の実装は、この型を継承してその機能を再利用できます。

1.  この問題を解決するために、`commonMain` で `expect` キーワードを使用してクラスを宣言します。

    ```kotlin
    expect class CommonIdentity() {
        val userName: String
        val processID: Long
    }
    ```

2.  `nativeMain` で、機能を実装する actual宣言を提供します。

    ```kotlin
    actual class CommonIdentity {
        actual val userName = getlogin()?.toKString() ?: "None"
        actual val processID = getpid().toLong()
    }
    ```

3.  `jvmMain` で、プラットフォーム固有の基底クラスを継承する actual宣言を提供します。

    ```kotlin
    actual class CommonIdentity : Identity() {
        actual val userName = login
        actual val processID = pid
    }
    ```

ここでは、`CommonIdentity` 型は、JVM 上の既存の型を活用しながら、自身の設計と互換性があります。

#### フレームワークでの適用

フレームワークの作者として、expected と actual 宣言が自身のフレームワークに役立つことを見出すこともできます。

上記の例がフレームワークの一部である場合、ユーザーは表示名を提供するために `CommonIdentity` から型を派生させる必要があります。

この場合、expected宣言は抽象であり、抽象メソッドを宣言します。

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同様に、actual実装は抽象であり、`displayName` メソッドを宣言します。

```kotlin
// In nativeMain of the framework codebase:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// In jvmMain of the framework codebase:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

フレームワークのユーザーは、expected宣言を継承し、欠落しているメソッドを自分で実装する共通コードを記述する必要があります。

```kotlin
// In commonMain of the users' codebase:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 高度なユースケース

Expected と Actual 宣言には、いくつかの特殊なケースがあります。

### 型エイリアスを使用して Actual 宣言を満たす

Actual宣言の実装は、ゼロから記述する必要はありません。サードパーティライブラリによって提供されるクラスなど、既存の型を使用できます。

その型が expected宣言に関連付けられたすべての要件を満たしている限り、この型を使用できます。例えば、次の 2 つの expected宣言を考えてみましょう。

```kotlin
expect enum class Month {
    JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
    AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
}

expect class MyDate {
    fun getYear(): Int
    fun getMonth(): Month
    fun getDayOfMonth(): Int
}
```

JVM モジュール内では、`java.time.Month` 列挙型を使用して最初の expected宣言を実装し、`java.time.LocalDate` クラスを使用して 2 番目の expected宣言を実装できます。ただし、これらの型に直接 `actual` キーワードを追加する方法はありません。

代わりに、[型エイリアス](https://kotlinlang.org/docs/type-aliases.html)を使用して、expected宣言とプラットフォーム固有の型を接続できます。

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

この場合、`typealias` 宣言は expected宣言と同じパッケージで定義し、参照されるクラスは別の場所に作成します。

> `LocalDate` 型は `Month` 列挙型を使用するため、両方を共通コードで expectedクラスとして宣言する必要があります。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### Actual 宣言での可視性の拡張

Actual実装を、対応する expected宣言よりも可視性を高くすることができます。これは、API を共通クライアントに公開したくない場合に役立ちます。

現在、Kotlin コンパイラは可視性の変更の場合にエラーを発行します。`@Suppress("ACTUAL_WITHOUT_EXPECT")` を actual型エイリアス宣言に適用することで、このエラーを抑制できます。Kotlin 2.0 以降、この制限は適用されなくなります。

たとえば、共通ソースセットで次の expected宣言を宣言した場合：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

プラットフォーム固有のソースセットでも、次の actual実装を使用できます。

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

ここでは、内部 expectedクラスが、型エイリアスを使用する既存の `public` な `MyMessenger` で actual実装を持っています。

### Actual化時の追加の列挙型エントリ

列挙型が共通ソースセットで `expect` で宣言されている場合、各プラットフォームモジュールは対応する `actual` 宣言を持つ必要があります。これらの宣言は同じ列挙型定数を含まなければなりませんが、追加の定数を持つこともできます。

これは、既存のプラットフォーム列挙型で expected列挙型を actual化する場合に役立ちます。例えば、共通ソースセットの次の列挙型を考えてみましょう。

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

プラットフォームソースセットで `Department` の actual宣言を提供すると、追加の定数を追加できます。

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

ただし、この場合、プラットフォームソースセットのこれらの追加定数は、共通コードの定数と一致しません。したがって、コンパイラは、すべての追加ケースを処理することを要求します。

`Department` で `when` 構成を実装する関数には `else` 句が必要です。

```kotlin
// An else clause is required:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The HR Department")
        Department.Sales -> println("The Sales Department")
        else -> println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### Expected アノテーションクラス

Expected と Actual 宣言はアノテーションと共に使用できます。例えば、`@XmlSerializable` アノテーションを宣言できます。これは、各プラットフォームソースセットに対応する actual宣言を持つ必要があります。

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

特定のプラットフォームで既存の型を再利用することは役立つ場合があります。例えば、JVM では、[JAXB 仕様](https://javaee.github.io/jaxb-v2/)の既存の型を使用してアノテーションを定義できます。

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

アノテーションクラスで `expect` を使用する場合、追加の考慮事項があります。アノテーションはコードにメタデータを付加するために使用され、シグネチャに型として現れません。expectedアノテーションが、それが不要なプラットフォームで actualクラスを持つことは必須ではありません。

アノテーションが使用されるプラットフォームでのみ `actual` 宣言を提供する必要があります。この動作はデフォルトでは有効になっておらず、型を [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/) でマークする必要があります。

上記で宣言した `@XmlSerializable` アノテーションに `OptionalExpectation` を追加してみましょう。

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

不要なプラットフォームで actual宣言が欠落している場合でも、コンパイラはエラーを生成しません。

## 次のステップ

プラットフォーム固有の API を使用するさまざまな方法に関する一般的な推奨事項については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md)を参照してください。