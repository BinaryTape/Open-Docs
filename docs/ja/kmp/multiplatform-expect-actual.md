[//]: # (title: 期待宣言と実体宣言)

期待宣言 (Expected declarations) と実体宣言 (Actual declarations) を使用すると、Kotlin マルチプラットフォームモジュールからプラットフォーム固有の API にアクセスできるようになります。
共通コード (common code) では、プラットフォームに依存しない API を提供できます。

> この記事では、期待宣言と実体宣言の言語メカニズムについて説明します。プラットフォーム固有の API を使用するためのさまざまな方法に関する一般的な推奨事項については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md)を参照してください。
>
{style="tip"}

## 期待宣言と実体宣言のルール

期待宣言と実体宣言を定義するには、以下のルールに従います。

1. 共通 (common) ソースセットで、標準的な Kotlin の構成要素を宣言します。これは関数、プロパティ、クラス、インターフェース、列挙型 (enum)、またはアノテーションのいずれかです。
2. この構成要素に `expect` キーワードを付けます。これが *期待宣言 (expected declaration)* です。これらの宣言は共通コードで使用できますが、実装を含めてはいけません。代わりに、プラットフォーム固有のコードがこの実装を提供します。
3. 各プラットフォーム固有のソースセットで、同じパッケージ内に同じ構成要素を宣言し、`actual` キーワードを付けます。これが *実体宣言 (actual declaration)* であり、通常はプラットフォーム固有のライブラリを使用した実装が含まれます。

特定のターゲット向けにコンパイルする際、コンパイラは見つかった各 *実体 (actual)* 宣言を、共通コード内の対応する *期待 (expected)* 宣言と一致させようとします。コンパイラは以下の点を確認します。

* 共通ソースセット内のすべての期待宣言に対して、すべてのプラットフォーム固有ソースセットに対応する実体宣言が存在すること。
* 期待宣言に実装が含まれていないこと。
* すべての実体宣言が、対応する期待宣言と同じパッケージ（例：`org.mygroup.myapp.MyType`）を共有していること。

異なるプラットフォーム向けの最終的なコードを生成する際、Kotlin コンパイラは互いに対応する期待宣言と実体宣言をマージします。各プラットフォームに対して、実際の詳細な実装を持つ 1 つの宣言を生成します。共通コードで期待宣言を使用するたびに、生成されたプラットフォームコード内の正しい実体宣言が呼び出されます。

異なるターゲットプラットフォーム間で共有される中間ソースセットを使用する場合でも、実体宣言を宣言できます。例えば、`iosX64Main`、`iosArm64Main`、`iosSimulatorArm64Main` の各プラットフォームソースセット間で共有される中間ソースセットとしての `iosMain` を考えてみましょう。通常、プラットフォームソースセットではなく、`iosMain` のみに実体宣言を含めます。Kotlin コンパイラは、これらの実体宣言を使用して、対応するプラットフォーム向けの最終的なコードを生成します。

IDE は、以下のような一般的な問題の解決を支援します。

* 宣言の不足
* 実装を含んでしまっている期待宣言
* 宣言シグネチャの不一致
* 異なるパッケージにある宣言

IDE を使用して、期待宣言から実体宣言へ移動することもできます。ガターアイコンを選択して実体宣言を表示するか、[ショートカット](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)を使用してください。

![期待宣言から実体宣言への IDE ナビゲーション](expect-actual-gutter.png){width=500}

## 期待宣言と実体宣言を使用するさまざまなアプローチ

共通コードでプラットフォーム API を操作する方法を提供しつつ、それらにアクセスするという問題を解決するために、expect/actual メカニズムを使用するさまざまなオプションを見ていきましょう。

ユーザーのログイン名と現在のプロセス ID を保持する `Identity` 型を実装する必要がある Kotlin マルチプラットフォームプロジェクトを想定します。このプロジェクトには、アプリケーションを JVM と iOS などのネイティブ環境で動作させるために、`commonMain`、`jvmMain`、および `nativeMain` ソースセットがあります。

### 期待関数と実体関数

`Identity` 型とファクトリ関数 `buildIdentity()` を定義できます。これは共通ソースセットで宣言され、プラットフォームソースセットごとに異なる方法で実装されます。

1. `commonMain` で、単純な型を宣言し、ファクトリ関数を expect 宣言します。

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. `jvmMain` ソースセットで、標準の Java ライブラリを使用してソリューションを実装します。

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. `nativeMain` ソースセットで、ネイティブの依存関係を使用して [POSIX](https://ja.wikipedia.org/wiki/POSIX) によるソリューションを実装します。

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

> Kotlin 1.9.0 以降、`getlogin()` および `getpid()` 関数を使用するには `@OptIn` アノテーションが必要です。
>
{style="note"}

### インターフェースと期待/実体関数

ファクトリ関数が大きくなりすぎる場合は、共通の `Identity` インターフェースを使用し、プラットフォームごとに異なる実装を行うことを検討してください。

`buildIdentity()` ファクトリ関数は `Identity` を返す必要がありますが、今回は共通インターフェースを実装したオブジェクトを返します。

1. `commonMain` で、`Identity` インターフェースと `buildIdentity()` ファクトリ関数を定義します。

   ```kotlin
   // commonMain ソースセット内:
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 期待宣言や実体宣言をこれ以上使用せずに、インターフェースのプラットフォーム固有の実装を作成します。

   ```kotlin
   // jvmMain ソースセット内:
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // nativeMain ソースセット内:
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

これらのプラットフォーム関数は、プラットフォーム型である `JVMIdentity` および `NativeIdentity` として実装された、プラットフォーム固有の `Identity` インスタンスを返します。

#### 期待プロパティと実体プロパティ

前の例を変更して、`Identity` を保持する `val` プロパティを期待宣言することもできます。

このプロパティを `expect val` としてマークし、プラットフォームソースセットで実体化します。

```kotlin
// commonMain ソースセット内:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
// jvmMain ソースセット内:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
// nativeMain ソースセット内:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 期待オブジェクトと実体オブジェクト

`IdentityBuilder` が各プラットフォームでシングルトンであることが期待される場合、それを期待オブジェクトとして定義し、各プラットフォームで実体化させることができます。

```kotlin
// commonMain ソースセット内:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// jvmMain ソースセット内:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// nativeMain ソースセット内:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 依存性の注入 (DI) に関する推奨事項

疎結合なアーキテクチャを作成するために、多くの Kotlin プロジェクトでは依存性の注入 (DI) フレームワークを採用しています。DI フレームワークを使用すると、現在の環境に基づいてコンポーネントに依存関係を注入できます。

例えば、テスト環境と本番環境、あるいはクラウドへのデプロイ時とローカルでのホスティング時で、異なる依存関係を注入することがあります。依存関係がインターフェースを通じて表現されている限り、コンパイル時または実行時のいずれかで、任意の数の異なる実装を注入できます。

依存関係がプラットフォーム固有である場合も、同じ原理が当てはまります。共通コードでは、コンポーネントは通常の [Kotlin インターフェース](https://kotlinlang.org/docs/interfaces.html)を使用して依存関係を表現できます。その後、DI フレームワークを設定して、例えば JVM や iOS モジュールから、プラットフォーム固有の実装を注入するようにできます。

これは、期待宣言と実体宣言が DI フレームワークの設定でのみ必要になることを意味します。例については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md#dependency-injection-framework)を参照してください。

このアプローチをとれば、インターフェースとファクトリ関数を使用するだけで Kotlin マルチプラットフォームを採用できます。プロジェクトの依存関係を管理するためにすでに DI フレームワークを使用している場合は、プラットフォームの依存関係を管理するためにも同じアプローチを使用することをお勧めします。

### 期待クラスと実体クラス

> 期待クラスと実体クラスは [Beta](supported-platforms.md#general-kotlin-stability-levels) です。
> ほぼ安定していますが、将来的に移行手順が必要になる可能性があります。
> 今後の変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

期待クラスと実体クラスを使用して同じソリューションを実装できます。

```kotlin
// commonMain ソースセット内:
expect class Identity() {
    val userName: String
    val processID: Long
}
```

```kotlin
// jvmMain ソースセット内:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// nativeMain ソースセット内:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

デモ資料などでこのアプローチを見たことがあるかもしれません。しかし、インターフェースで十分な単純なケースでクラスを使用することは *推奨されません*。

インターフェースを使用すれば、設計をターゲットプラットフォームごとに 1 つの実装に限定することはありません。また、テストで偽の実装に置き換えたり、単一のプラットフォームで複数の実装を提供したりすることもはるかに容易になります。

一般的なルールとして、期待宣言や実体宣言を使用する代わりに、可能な限り標準的な言語構成要素に頼るようにしてください。

期待クラスと実体クラスを使用することにした場合、Kotlin コンパイラはこの機能が Beta ステータスであることについて警告を出します。この警告を抑制するには、Gradle ビルドファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        // すべての Kotlin ソースセットに適用される共通のコンパイラオプション
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### プラットフォームクラスからの継承

クラスに対して `expect` キーワードを使用することが最善のアプローチとなる特殊なケースがあります。例えば、JVM 上にすでに `Identity` 型が存在するとします。

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

既存のコードベースやフレームワークに適合させるために、`Identity` 型の実装をこの型から継承させ、その機能を再利用したい場合があります。

1. この問題を解決するには、`expect` キーワードを使用して `commonMain` でクラスを宣言します。

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. `nativeMain` で、機能を実装する実体宣言を提供します。

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. `jvmMain` で、プラットフォーム固有の基本クラスから継承する実体宣言を提供します。

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

ここで、`CommonIdentity` 型は、JVM 上の既存の型を活用しつつ、独自の設計とも互換性があります。

#### フレームワークでの応用

フレームワークの開発者にとっても、期待宣言と実体宣言が役立つことがあります。

上記の例がフレームワークの一部である場合、ユーザーは表示名を提供するために `CommonIdentity` から型を派生させる必要があります。

この場合、期待宣言は抽象クラス（abstract class）になり、抽象メソッドを宣言します。

```kotlin
// フレームワークのコードベースの commonMain 内:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同様に、実体実装も抽象クラスとなり、`displayName` メソッドを宣言します。

```kotlin
// フレームワークのコードベースの nativeMain 内:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// フレームワークのコードベースの jvmMain 内:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

フレームワークのユーザーは、期待宣言から継承する共通コードを記述し、不足しているメソッドを自分で実装する必要があります。

```kotlin
// ユーザーのコードベースの commonMain 内:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- 同様のスキームは、Android または iOS 開発用の共通 `ViewModel` を提供するライブラリでも機能します。そのようなライブラリは通常、期待される `CommonViewModel` クラスを提供し、その実際的な Android 側の対応物は Android フレームワークの `ViewModel` クラスを拡張します。この例の詳細については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)を参照してください。 -->

## 高度なユースケース

期待宣言と実体宣言に関しては、いくつかの特殊なケースがあります。

### 型エイリアスを使用した実体宣言の充足

実体宣言の実装をゼロから書く必要はありません。サードパーティライブラリによって提供されるクラスなどの既存の型を使用できます。

期待宣言に関連するすべての要件を満たしている限り、その型を使用できます。例えば、次の 2 つの期待宣言を考えてみましょう。

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

JVM モジュール内では、最初の期待宣言の実装に `java.time.Month` 列挙型を使用し、2 番目の実装に `java.time.LocalDate` クラスを使用できます。ただし、これらの型に直接 `actual` キーワードを追加する方法はありません。

代わりに、[型エイリアス (type aliases)](https://kotlinlang.org/docs/type-aliases.html) を使用して、期待宣言とプラットフォーム固有の型を接続できます。

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

この場合、期待宣言と同じパッケージ内に `typealias` 宣言を定義し、参照されるクラスは別の場所で作成します。

> `LocalDate` 型は `Month` 列挙型を使用するため、共通コードで両方を期待クラスとして宣言する必要があります。
>
{style="note"}

<!-- このパターンの Android 固有の例については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)を参照してください。 -->

### 実体宣言での可視性の拡大

対応する期待宣言よりも実体実装の可視性（アクセス修飾子）を高くすることができます。これは、共通のクライアントに対して API を公開したくない場合に便利です。

現在、Kotlin コンパイラは可視性が変更された場合にエラーを出します。実体の型エイリアス宣言に `@Suppress("ACTUAL_WITHOUT_EXPECT")` を適用することで、このエラーを抑制できます。Kotlin 2.0 以降、この制限は適用されなくなります。

例えば、共通ソースセットで次のような期待宣言を宣言したとします。

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

プラットフォーム固有のソースセットで、次のような実体実装を使用することもできます。

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

ここでは、internal な期待クラスが、型エイリアスを使用して既存の public な `MyMessenger` を実体実装として持っています。

### 実体化時の列挙型エントリの追加

共通ソースセットで列挙型（enum）が `expect` で宣言されている場合、各プラットフォームモジュールには対応する `actual` 宣言が必要です。これらの宣言には同じ enum 定数が含まれている必要がありますが、追加の定数を含めることもできます。

これは、期待される enum を既存のプラットフォームの enum で実体化する場合に便利です。例えば、共通ソースセットに次の列挙型があるとします。

```kotlin
// commonMain ソースセット内:
expect enum class Department { IT, HR, Sales }
```

プラットフォームソースセットで `Department` の実体宣言を提供する際に、追加の定数を追加できます。

```kotlin
// jvmMain ソースセット内:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// nativeMain ソースセット内:
actual enum class Department { IT, HR, Sales, Marketing }
```

ただし、この場合、プラットフォームソースセット内のこれらの追加定数は、共通コード内の定数とは一致しません。したがって、コンパイラはすべての追加ケースを処理することを要求します。

`Department` に対して `when` 構文を実装する関数には、`else` 句が必要になります。

```kotlin
// else 句が必要です:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The HR Department")
        Department.Sales -> println("The Sales Department")
        else -> println("Some other department")
    }
}
```

<!-- 実体の enum で新しい定数を追加することを禁止したい場合は、この issue [TODO] に投票してください。 -->

### 期待アノテーションクラス

期待宣言と実体宣言はアノテーションでも使用できます。例えば、`@XmlSerializable` アノテーションを宣言し、各プラットフォームソースセットに対応する実体宣言を持たせることができます。

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

特定のプラットフォームで既存の型を再利用すると役立つ場合があります。例えば JVM では、[JAXB 仕様](https://javaee.github.io/jaxb-v2/)の既存の型を使用してアノテーションを定義できます。

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

アノテーションクラスに `expect` を使用する際には、追加の考慮事項があります。アノテーションはコードにメタデータを付加するために使用され、シグネチャには型として現れません。期待されるアノテーションが、それを必要としないプラットフォーム上で実体クラスを持つことは必須ではありません。

アノテーションが使用されるプラットフォーム上でのみ `actual` 宣言を提供すれば済みます。この動作はデフォルトでは有効になっておらず、型に [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/) をマークする必要があります。

上記で宣言した `@XmlSerializable` アノテーションに `OptionalExpectation` を追加します。

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

実体宣言が必要ないプラットフォームで欠落していても、コンパイラはエラーを生成しません。

## 次のステップ

プラットフォーム固有の API を使用するためのさまざまな方法に関する一般的な推奨事項については、[プラットフォーム固有の API の使用](multiplatform-connect-to-apis.md)を参照してください。