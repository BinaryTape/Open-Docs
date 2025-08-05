[//]: # (title: ExpectedとActualの宣言)

ExpectedとActualの宣言を使用すると、Kotlin Multiplatformモジュールからプラットフォーム固有のAPIにアクセスできます。共通コードでプラットフォームに依存しないAPIを提供できます。

> この記事では、ExpectedとActualの宣言の言語メカニズムについて説明します。プラットフォーム固有のAPIを使用するさまざまな方法に関する一般的な推奨事項については、「[プラットフォーム固有のAPIの使用](multiplatform-connect-to-apis.md)」を参照してください。
>
{style="tip"}

## ExpectedとActualの宣言のルール

ExpectedとActualの宣言を定義するには、以下のルールに従います。

1.  共通ソースセットで、標準的なKotlinの構成要素を宣言します。これは、関数、プロパティ、クラス、インターフェース、列挙型、またはアノテーションです。
2.  この構成要素を`expect`キーワードでマークします。これがあなたの_Expected宣言_です。これらの宣言は共通コードで使用できますが、実装を含めるべきではありません。代わりに、プラットフォーム固有のコードがこの実装を提供します。
3.  各プラットフォーム固有のソースセットで、同じパッケージ内で同じ構成要素を宣言し、`actual`キーワードでマークします。これがあなたの_Actual宣言_であり、通常、プラットフォーム固有のライブラリを使用した実装が含まれます。

特定のターゲット向けにコンパイルする際、コンパイラは、見つかった_Actual_宣言のそれぞれを、共通コード内の対応する_Expected_宣言と照合しようとします。コンパイラは以下を保証します。

*   共通ソースセットのすべてのExpected宣言には、すべてのプラットフォーム固有のソースセットに対応するActual宣言があります。
*   Expected宣言は実装を含みません。
*   すべてのActual宣言は、`org.mygroup.myapp.MyType`のように、対応するExpected宣言と同じパッケージを共有します。

異なるプラットフォーム向けに結果のコードを生成する際、Kotlinコンパイラは互いに対応するExpectedとActualの宣言をマージします。各プラットフォームに対して、そのActual実装を持つ1つの宣言を生成します。共通コードにおけるExpected宣言のすべての使用は、結果として生成されるプラットフォームコード内の正しいActual宣言を呼び出します。

異なるターゲットプラットフォーム間で共有される中間ソースセットを使用する場合にも、Actual宣言を定義できます。例えば、`iosX64Main`、`iosArm64Main`、`iosSimulatorArm64Main`のプラットフォームソースセット間で共有される中間ソースセットとして`iosMain`を考えてみましょう。通常、Actual宣言は`iosMain`にのみ含まれ、プラットフォームソースセットには含まれません。その後、KotlinコンパイラはこれらのActual宣言を使用して、対応するプラットフォーム向けの結果のコードを生成します。

IDEは、次のような一般的な問題で役立ちます。

*   宣言の不足
*   実装を含むExpected宣言
*   宣言シグネチャの不一致
*   異なるパッケージ内の宣言

IDEは、Expected宣言からActual宣言へ移動するためにも使用できます。ガターアイコンを選択してActual宣言を表示するか、[ショートカット](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)を使用します。

![Expected宣言からActual宣言へのIDEナビゲーション](expect-actual-gutter.png){width=500}

## ExpectedとActualの宣言を使用するさまざまなアプローチ

プラットフォームAPIへのアクセスという問題を解決しつつ、共通コードでそれらを操作する方法も提供するために、expect/actualメカニズムを使用するさまざまな選択肢を探ってみましょう。

ユーザーのログイン名と現在のプロセスIDを含む`Identity`型を実装する必要があるKotlin Multiplatformプロジェクトを考えてみましょう。このプロジェクトには、アプリケーションをJVMおよびiOSのようなネイティブ環境で動作させるための`commonMain`、`jvmMain`、`nativeMain`ソースセットがあります。

### ExpectedとActualの関数

`Identity`型と、共通ソースセットで宣言され、プラットフォームソースセットで異なる方法で実装されるファクトリ関数`buildIdentity()`を定義できます。

1.  `commonMain`で、単純な型を宣言し、ファクトリ関数をexpectします。

    ```kotlin
    package identity

    class Identity(val userName: String, val processID: Long)
   
    expect fun buildIdentity(): Identity
    ```

2.  `jvmMain`ソースセットで、標準Javaライブラリを使用してソリューションを実装します。

    ```kotlin
    package identity
   
    import java.lang.System
    import java.lang.ProcessHandle

    actual fun buildIdentity() = Identity(
        System.getProperty("user.name") ?: "None",
        ProcessHandle.current().pid()
    )
    ```

3.  `nativeMain`ソースセットで、ネイティブ依存関係を使用して[POSIX](https://en.wikipedia.org/wiki/POSIX)によるソリューションを実装します。

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

   ここで、プラットフォーム関数はプラットフォーム固有の`Identity`インスタンスを返します。

> Kotlin 1.9.0以降、`getlogin()`および`getpid()`関数を使用するには、`@OptIn`アノテーションが必要です。
>
{style="note"}

### ExpectedとActualの関数を持つインターフェース

ファクトリ関数が大きくなりすぎる場合は、共通の`Identity`インターフェースを使用し、それを異なるプラットフォームで異なる方法で実装することを検討してください。

`buildIdentity()`ファクトリ関数は`Identity`を返すべきですが、今回は共通インターフェースを実装するオブジェクトです。

1.  `commonMain`で、`Identity`インターフェースと`buildIdentity()`ファクトリ関数を定義します。

    ```kotlin
    // In the commonMain source set:
    expect fun buildIdentity(): Identity
    
    interface Identity {
        val userName: String
        val processID: Long
    }
    ```

2.  ExpectedとActualの宣言をさらに使用せずに、インターフェースのプラットフォーム固有の実装を作成します。

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

これらのプラットフォーム関数はプラットフォーム固有の`Identity`インスタンスを返します。これらは`JVMIdentity`および`NativeIdentity`というプラットフォーム型として実装されています。

#### ExpectedとActualのプロパティ

前の例を変更し、`Identity`を格納する`val`プロパティをexpectすることもできます。

このプロパティを`expect val`としてマークし、その後プラットフォームソースセットでactualizeします。

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

#### ExpectedとActualのオブジェクト

`IdentityBuilder`が各プラットフォームでシングルトンであると期待される場合、それをExpectedオブジェクトとして定義し、プラットフォームでactualizeさせることができます。

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

疎結合なアーキテクチャを構築するために、多くのKotlinプロジェクトは依存性注入（DI）フレームワークを採用しています。DIフレームワークを使用すると、現在の環境に基づいてコンポーネントに依存性を注入できます。

例えば、テスト時と本番時で、あるいはクラウドにデプロイする場合とローカルでホストする場合とで、異なる依存性を注入することができます。依存性がインターフェースを通じて表現されている限り、コンパイル時または実行時に、いくらでも異なる実装を注入できます。

依存性がプラットフォーム固有である場合にも同じ原則が適用されます。共通コードでは、コンポーネントは通常の[Kotlinインターフェース](https://kotlinlang.org/docs/interfaces.html)を使用して依存性を表現できます。その後、DIフレームワークを構成して、プラットフォーム固有の実装（例えば、JVMまたはiOSモジュールからのもの）を注入できます。

これは、ExpectedとActualの宣言がDIフレームワークの構成でのみ必要となることを意味します。例については、「[プラットフォーム固有のAPIの使用](multiplatform-connect-to-apis.md#dependency-injection-framework)」を参照してください。

このアプローチにより、インターフェースとファクトリ関数を使用するだけでKotlin Multiplatformを採用できます。すでにプロジェクトでDIフレームワークを使用して依存関係を管理している場合は、プラットフォーム依存関係の管理にも同じアプローチを使用することをお勧めします。

### ExpectedとActualのクラス

> ExpectedとActualのクラスは[ベータ版](supported-platforms.md#general-kotlin-stability-levels)です。これらはほぼ安定していますが、将来的に移行手順が必要になる場合があります。今後必要な変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

ExpectedとActualのクラスを使用して、同じソリューションを実装できます。

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

このアプローチはデモンストレーション資料で既に見たことがあるかもしれません。しかし、インターフェースで十分な単純なケースでクラスを使用することは_推奨されません_。

インターフェースを使用すると、ターゲットプラットフォームごとに1つの実装に設計を限定しません。また、テストで偽の実装を置き換えたり、単一のプラットフォームで複数の実装を提供したりすることがはるかに簡単になります。

一般的なルールとして、ExpectedとActualの宣言を使用する代わりに、可能な限り標準的な言語構成要素に依拠してください。

ExpectedとActualのクラスを使用することを決定した場合、Kotlinコンパイラは機能のベータ状態について警告します。この警告を抑制するには、以下のコンパイラオプションをGradleビルドファイルに追加します。

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### プラットフォームクラスからの継承

クラスで`expect`キーワードを使用するのが最善のアプローチとなる特別なケースがあります。`Identity`型がすでにJVM上に存在するとします。

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

既存のコードベースやフレームワークに適合させるため、`Identity`型の実装は、この型から継承し、その機能を再利用できます。

1.  この問題を解決するには、`commonMain`で`expect`キーワードを使用してクラスを宣言します。

    ```kotlin
    expect class CommonIdentity() {
        val userName: String
        val processID: Long
    }
    ```

2.  `nativeMain`で、機能性を実装するActual宣言を提供します。

    ```kotlin
    actual class CommonIdentity {
        actual val userName = getlogin()?.toKString() ?: "None"
        actual val processID = getpid().toLong()
    }
    ```

3.  `jvmMain`で、プラットフォーム固有の基底クラスから継承するActual宣言を提供します。

    ```kotlin
    actual class CommonIdentity : Identity() {
        actual val userName = login
        actual val processID = pid
    }
    ```

ここで、`CommonIdentity`型は、JVM上の既存の型を活用しながら、自身の設計と互換性があります。

#### フレームワークでの応用

フレームワークの作者として、ExpectedとActualの宣言が自身のフレームワークに役立つこともあります。

上記の例がフレームワークの一部である場合、ユーザーは表示名を提供するために`CommonIdentity`から型を派生させる必要があります。

この場合、Expected宣言は抽象的であり、抽象メソッドを宣言します。

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同様に、Actual実装も抽象的であり、`displayName`メソッドを宣言します。

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

フレームワークのユーザーは、Expected宣言から継承し、不足しているメソッドを自身で実装する共通コードを記述する必要があります。

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

ExpectedとActualの宣言には、いくつかの特別なケースがあります。

### Actual宣言を満たすための型エイリアスの使用

Actual宣言の実装はゼロから記述される必要はありません。サードパーティライブラリによって提供されるクラスなど、既存の型を使用できます。

この型は、Expected宣言に関連するすべての要件を満たしている限り使用できます。例えば、次の2つのExpected宣言を考えてみましょう。

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

JVMモジュール内では、`java.time.Month`列挙型を最初のExpected宣言の実装に、`java.time.LocalDate`クラスを2番目の実装に使用できます。しかし、これらの型に`actual`キーワードを直接追加する方法はありません。

代わりに、[型エイリアス](https://kotlinlang.org/docs/type-aliases.html)を使用してExpected宣言とプラットフォーム固有の型を接続できます。

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

この場合、`typealias`宣言をExpected宣言と同じパッケージで定義し、参照されるクラスは別の場所に作成します。

> `LocalDate`型が`Month`列挙型を使用するため、両方を共通コードでExpectedクラスとして宣言する必要があります。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### Actual宣言における可視性の拡張

Actual実装を対応するExpected宣言よりも可視性を高くすることができます。これは、共通クライアントに対してAPIを公開したくない場合に便利です。

現在、Kotlinコンパイラは可視性の変更がある場合にエラーを発行します。`@Suppress("ACTUAL_WITHOUT_EXPECT")`をActual型エイリアス宣言に適用することで、このエラーを抑制できます。Kotlin 2.0以降、この制限は適用されなくなります。

例えば、共通ソースセットで以下のExpected宣言を宣言した場合:

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

プラットフォーム固有のソースセットでも以下のActual実装を使用できます。

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

ここで、internalなExpectedクラスは、型エイリアスを使用して既存のpublicな`MyMessenger`によるActual実装を持っています。

### Actual化における追加の列挙エントリ

共通ソースセットで列挙型が`expect`で宣言されている場合、各プラットフォームモジュールには対応する`actual`宣言が必要です。これらの宣言は同じ列挙定数を含んでいる必要がありますが、追加の定数を持つこともできます。

これは、既存のプラットフォーム列挙型でExpected列挙型をactualizeする場合に便利です。例えば、共通ソースセットの以下の列挙型を考えてみましょう。

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

プラットフォームソースセットで`Department`のActual宣言を提供する場合、追加の定数を追加できます。

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

しかし、この場合、プラットフォームソースセットのこれらの追加定数は、共通コードのものと一致しません。そのため、コンパイラは、すべての追加ケースを処理することを要求します。

`Department`に対する`when`構造を実装する関数には、`else`句が必要です。

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

### Expectedアノテーションクラス

ExpectedとActualの宣言はアノテーションと共に使用できます。例えば、`@XmlSerializable`アノテーションを宣言できます。これには、各プラットフォームソースセットに対応するActual宣言が必要です。

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

特定のプラットフォームで既存の型を再利用するのに役立つ場合があります。例えば、JVMでは、[JAXB仕様](https://javaee.github.io/jaxb-v2/)の既存の型を使用してアノテーションを定義できます。

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

`expect`をアノテーションクラスと共に使用する場合、追加の考慮事項があります。アノテーションはコードにメタデータを付加するために使用され、シグネチャに型として現れません。Expectedアノテーションが、決して必要とされないプラットフォームでActualクラスを持つことは必須ではありません。

アノテーションが使用されるプラットフォームでのみ`actual`宣言を提供する必要があります。この動作はデフォルトでは有効になっておらず、型が[`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)でマークされている必要があります。

上記で宣言した`@XmlSerializable`アノテーションに`OptionalExpectation`を追加します。

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

必要とされないプラットフォームでActual宣言が欠落している場合、コンパイラはエラーを生成しません。

## 次のステップ

プラットフォーム固有のAPIを使用するさまざまな方法に関する一般的な推奨事項については、「[プラットフォーム固有のAPIの使用](multiplatform-connect-to-apis.md)」を参照してください。