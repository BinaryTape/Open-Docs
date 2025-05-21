---
title: Expectedとactualの宣言
---
予期される宣言と実際の宣言を使用すると、Kotlin Multiplatformモジュールからプラットフォーム固有のAPIにアクセスできます。
共通コードでプラットフォームに依存しないAPIを提供できます。

:::note
この記事では、予期される宣言と実際の宣言の言語メカニズムについて説明します。
プラットフォーム固有のAPIのさまざまな使用方法に関する一般的な推奨事項については、[プラットフォーム固有のAPIの使用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)を参照してください。

## 予期される宣言と実際の宣言のルール

予期される宣言と実際の宣言を定義するには、次のルールに従います。

1. 共通ソースセットで、標準のKotlinコンストラクトを宣言します。これは、関数、プロパティ、クラス、インターフェース、列挙型、またはアノテーションです。
2. このコンストラクトを `expect` キーワードでマークします。これが _予期される宣言_ です。これらの宣言は共通コードで使用できますが、実装を含めるべきではありません。代わりに、プラットフォーム固有のコードがこの実装を提供します。
3. 各プラットフォーム固有のソースセットで、同じパッケージ内の同じコンストラクトを宣言し、`actual` キーワードでマークします。これが _実際の宣言_ であり、通常はプラットフォーム固有のライブラリを使用した実装が含まれています。

特定のターゲットのコンパイル中に、コンパイラーは、見つかった各 _実際の_ 宣言を、共通コード内の対応する _予期される_ 宣言と一致させようとします。コンパイラーは、以下を確認します。

* 共通ソースセット内のすべての予期される宣言に、すべてのプラットフォーム固有のソースセットに対応する実際の宣言があること。
* 予期される宣言に実装が含まれていないこと。
* すべての実際の宣言が、対応する予期される宣言と同じパッケージ（`org.mygroup.myapp.MyType` など）を共有していること。

Kotlinコンパイラーは、さまざまなプラットフォームの結果コードを生成する際に、互いに対応する予期される宣言と実際の宣言をマージします。各プラットフォームの実際の実装を含む1つの宣言を生成します。共通コードでの予期される宣言の使用はすべて、結果のプラットフォームコードで正しい実際の宣言を呼び出します。

異なるターゲットプラットフォーム間で共有される中間ソースセットを使用する場合、実際の宣言を宣言できます。
たとえば、`iosX64Main`、`iosArm64Main`、および `iosSimulatorArm64Main` プラットフォームソースセット間で共有される中間ソースセットとして `iosMain` を考えます。通常、`iosMain` のみが実際の宣言を含み、プラットフォームソースセットは含みません。Kotlinコンパイラーは、これらの実際の宣言を使用して、対応するプラットフォームの結果コードを生成します。

IDEは、次のような一般的な問題に対応します。

* 宣言がない
* 実装を含む予期される宣言
* 一致しない宣言シグネチャ
* 異なるパッケージ内の宣言

IDEを使用して、予期される宣言から実際の宣言に移動することもできます。ガターアイコンを選択して実際の宣言を表示するか、[ショートカット](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)を使用します。

<img src="/img/expect-actual-gutter.png" alt="予期される宣言から実際の宣言へのIDEナビゲーション" width="500" style={{verticalAlign: 'middle'}}/>

## 予期される宣言と実際の宣言を使用するさまざまなアプローチ

プラットフォームAPIへのアクセスという問題を解決するために、expect/actualメカニズムを使用するさまざまなオプションを検討し、共通コードでAPIを操作する方法を提供します。

ユーザーのログイン名と現在のプロセスIDを含む `Identity` 型を実装する必要があるKotlin Multiplatformプロジェクトを考えます。このプロジェクトには、JVMやiOSなどのネイティブ環境でアプリケーションを動作させるための `commonMain`、`jvmMain`、および `nativeMain` ソースセットがあります。

### 予期される関数と実際の関数

`Identity` 型とファクトリ関数 `buildIdentity()` を定義できます。これは、共通ソースセットで宣言され、プラットフォームソースセットで異なる方法で実装されます。

1. `commonMain` で、単純な型を宣言し、ファクトリ関数を予期します。

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. `jvmMain` ソースセットで、標準のJavaライブラリを使用してソリューションを実装します。

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. `nativeMain` ソースセットで、ネイティブ依存関係を使用して[POSIX](https://en.wikipedia.org/wiki/POSIX)でソリューションを実装します。

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

  ここで、プラットフォーム関数はプラットフォーム固有の `Identity` インスタンスを返します。

Kotlin 1.9.0以降では、`getlogin()` および `getpid()` 関数を使用するには、`@OptIn` アノテーションが必要です。

:::

### 予期される関数と実際の関数を持つインターフェース

ファクトリ関数が大きすぎる場合は、共通の `Identity` インターフェースを使用し、それを異なるプラットフォームで異なる方法で実装することを検討してください。

`buildIdentity()` ファクトリ関数は `Identity` を返す必要がありますが、今回は共通インターフェースを実装するオブジェクトです。

1. `commonMain` で、`Identity` インターフェースと `buildIdentity()` ファクトリ関数を定義します。

   ```kotlin
   // commonMainソースセット内：
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 予期される宣言と実際の宣言を追加で使用せずに、インターフェースのプラットフォーム固有の実装を作成します。

   ```kotlin
   // jvmMainソースセット内：
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // nativeMainソースセット内：
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

これらのプラットフォーム関数は、プラットフォーム固有の `Identity` インスタンスを返します。これらは、`JVMIdentity` および `NativeIdentity` プラットフォーム型として実装されます。

#### 予期されるプロパティと実際のプロパティ

前の例を変更して、`val` プロパティが `Identity` を格納することを予期できます。

このプロパティを `expect val` としてマークし、プラットフォームソースセットで実際に実行します。

```kotlin
//commonMainソースセット内：
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//jvmMainソースセット内：
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//nativeMainソースセット内：
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 予期されるオブジェクトと実際のオブジェクト

`IdentityBuilder` が各プラットフォームでシングルトンになることが予想される場合は、それを予期されるオブジェクトとして定義し、プラットフォームに実際に実行させることができます。

```kotlin
// commonMainソースセット内：
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// jvmMainソースセット内：
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// nativeMainソースセット内：
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 依存性注入に関する推奨事項

疎結合アーキテクチャを作成するために、多くのKotlinプロジェクトは依存性注入（DI）フレームワークを採用しています。DI
フレームワークを使用すると、現在の環境に基づいて依存関係をコンポーネントに注入できます。

たとえば、テスト環境と本番環境で、またはローカルでホストする場合と比較してクラウドにデプロイする場合に、異なる依存関係を注入する場合があります。依存関係がインターフェースを介して表現されている限り、コンパイル時または実行時に、任意の数の異なる実装を注入できます。

同じ原則が、依存関係がプラットフォーム固有の場合にも適用されます。共通コードでは、コンポーネントは通常の[Kotlinインターフェース](interfaces)を使用して依存関係を表現できます。次に、DIフレームワークを構成して、たとえば、JVMまたはiOSモジュールからプラットフォーム固有の実装を注入できます。

つまり、予期される宣言と実際の宣言は、DIの構成でのみ必要です。
フレームワーク。[プラットフォーム固有のAPIの使用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html#dependency-injection-framework)で例を参照してください。

このアプローチを使用すると、インターフェースとファクトリ関数を使用するだけで、Kotlin Multiplatformを簡単に採用できます。プロジェクトで依存関係を管理するためにDIフレームワークをすでに使用している場合は、プラットフォームの依存関係の管理にも同じアプローチを使用することをお勧めします。

### 予期されるクラスと実際のクラス

:::note
予期されるクラスと実際のクラスは[ベータ版](components-stability)です。
ほぼ安定していますが、将来的には移行手順が必要になる場合があります。
変更を最小限に抑えるために最善を尽くします。

予期されるクラスと実際のクラスを使用して同じソリューションを実装できます。

```kotlin
// commonMainソースセット内：
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// jvmMainソースセット内：
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// nativeMainソースセット内：
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

このアプローチは、デモンストレーション資料ですでに見たことがあるかもしれません。ただし、インターフェースで十分な単純なケースでクラスを使用することは _推奨されません_ 。

インターフェースを使用すると、ターゲットプラットフォームごとの1つの実装に設計を制限する必要はありません。また、テストで偽の実装を代替したり、単一のプラットフォームで複数の実装を提供したりする方がはるかに簡単です。

原則として、予期される宣言と実際の宣言を使用する代わりに、可能な限り標準の言語構造に依存してください。

予期されるクラスと実際のクラスを使用することにした場合、Kotlinコンパイラーは機能のベータ版ステータスについて警告します。この警告を抑制するには、次のコンパイラーオプションをGradleビルドファイルに追加します。

```kotlin
kotlin {
    compilerOptions {
        // すべてのKotlinソースセットに適用される共通コンパイラーオプション
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### プラットフォームクラスからの継承

クラスで `expect` キーワードを使用するのが最適なアプローチである特別なケースがあります。`Identity` 型がJVMにすでに存在するとします。

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

既存のコードベースとフレームワークに適合させるために、`Identity` 型の実装は、この型から継承し、その機能を再利用できます。

1. この問題を解決するには、`expect` キーワードを使用して `commonMain` でクラスを宣言します。

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. `nativeMain` で、機能を実装する実際の宣言を提供します。

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. `jvmMain` で、プラットフォーム固有の基本クラスから継承する実際の宣言を提供します。

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

ここで、`CommonIdentity` 型は独自の設計と互換性がありながら、JVM上の既存の型を利用しています。

#### フレームワークでのアプリケーション

フレームワークの作成者として、予期される宣言と実際の宣言がフレームワークに役立つこともあります。

上記の例がフレームワークの一部である場合、ユーザーは `CommonIdentity` から型を派生させて、表示名を提供する必要があります。

この場合、予期される宣言は抽象的であり、抽象メソッドを宣言します。

```kotlin
// フレームワークコードベースのcommonMain内：
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同様に、実際の実装は抽象的であり、`displayName` メソッドを宣言します。

```kotlin
// フレームワークコードベースのnativeMain内：
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// フレームワークコードベースのjvmMain内：
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

フレームワークユーザーは、予期される宣言から継承し、不足しているメソッドを自分で実装する共通コードを作成する必要があります。

```kotlin
// ユーザーのコードベースのcommonMain内：
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 高度なユースケース

予期される宣言と実際の宣言に関する特別なケースがいくつかあります。

### 型エイリアスを使用して実際の宣言を満たす

実際の宣言の実装は、最初から記述する必要はありません。サードパーティのライブラリによって提供されるクラスなど、既存の型にすることができます。

この型は、予期される宣言に関連付けられたすべての要件を満たしている限り使用できます。たとえば、次の2つの予期される宣言を考えてください。

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

JVMモジュール内では、`java.time.Month`列挙型を使用して最初の予期される宣言を実装でき、`java.time.LocalDate`クラスを使用して2番目の予期される宣言を実装できます。ただし、これらの型に `actual` キーワードを直接追加する方法はありません。

代わりに、[型エイリアス](type-aliases)を使用して、予期される宣言とプラットフォーム固有の型を接続できます。

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

この場合、予期される宣言と同じパッケージで `typealias` 宣言を定義し、参照されるクラスを他の場所に作成します。

`LocalDate` 型は `Month` 列挙型を使用するため、両方を共通コードで予期されるクラスとして宣言する必要があります。

:::

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 実際の宣言での可視性の拡張

実際の宣言を、対応する予期される宣言よりも可視性を高めることができます。これは、APIを共通クライアントに対してパブリックとして公開したくない場合に役立ちます。

現在、Kotlinコンパイラーは、可視性の変更の場合にエラーを発行します。`@Suppress("ACTUAL_WITHOUT_EXPECT")`を実際の型エイリアス宣言に適用することで、このエラーを抑制できます。Kotlin 2.0以降では、この制限は適用されません。

たとえば、共通ソースセットで次の予期される宣言を宣言する場合：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

プラットフォーム固有のソースセットで次の実際の実装も使用できます。

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

ここで、内部の予期されるクラスには、型エイリアスを使用する既存のパブリック `MyMessenger` を使用した実際の実装があります。

### 実際の列挙エントリの追加

列挙型が共通ソースセットで `expect` で宣言されている場合、各プラットフォームモジュールには対応する `actual` 宣言が必要です。これらの宣言には同じ列挙定数が含まれている必要がありますが、追加の定数を含めることもできます。

これは、既存のプラットフォーム列挙型で予期される列挙型を実際に実行する場合に役立ちます。たとえば、共通ソースセットで次の列挙型を考えてください。

```kotlin
// commonMainソースセット内：
expect enum class Department { IT, HR, Sales }
```

プラットフォームソースセットで `Department` の実際の宣言を提供する場合、追加の定数を追加できます。

```kotlin
// jvmMainソースセット内：
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// nativeMainソースセット内：
actual enum class Department { IT, HR, Sales, Marketing }
```

ただし、この場合、プラットフォームソースセットのこれらの追加の定数は、共通コードの定数と一致しません。
したがって、コンパイラーはすべての追加のケースを処理する必要があります。

`Department` で `when` 構造を実装する関数には、`else` 句が必要です。

```kotlin
// else句が必要です：
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT `->` println("The IT Department")
        Department.HR `->` println("The HR Department")
        Department.Sales `->` println("The Sales Department")
        else `->` println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### 予期されるアノテーションクラス

予期される宣言と実際の宣言は、アノテーションで使用できます。たとえば、`@XmlSerializable`
アノテーションを宣言できます。これには、各プラットフォームソースセットに対応する実際の宣言が必要です。

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

特定のプラットフォームで既存の型を再利用すると便利な場合があります。たとえば、JVMでは、[JAXB仕様](https://javaee.github.io/jaxb-v2/)の既存の型を使用してアノテーションを定義できます。

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

アノテーションクラスで `expect` を使用する場合は、追加の考慮事項があります。アノテーションは、コードにメタデータを添付するために使用され、シグネチャに型として表示されません。予期されるアノテーションが、不要なプラットフォームに実際のクラスを持つことは必須ではありません。

アノテーションが使用されているプラットフォームでのみ `actual` 宣言を提供する必要があります。この
動作はデフォルトでは有効になっておらず、型を[`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)でマークする必要があります。

上記で宣言された `@XmlSerializable` アノテーションを取得し、`OptionalExpectation` を追加します。

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

不要なプラットフォームで実際の宣言が見つからない場合、コンパイラーはエラーを生成しません。

## 次は何ですか？

プラットフォーム固有のAPIのさまざまな使用方法に関する一般的な推奨事項については、[プラットフォーム固有のAPIの使用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)を参照してください。