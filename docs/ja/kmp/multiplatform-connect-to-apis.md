[//]: # (title: プラットフォーム固有のAPIを使用する)

この記事では、マルチプラットフォームアプリケーションやライブラリを開発する際に、プラットフォーム固有のAPIを使用する方法を学びます。

## Kotlinマルチプラットフォームライブラリ

プラットフォーム固有のAPIを使用するコードを記述する前に、代わりにマルチプラットフォームライブラリを使用できるかどうかを確認してください。
この種のライブラリは、異なるプラットフォーム向けに異なる実装を持つ共通のKotlin APIを提供します。

ネットワーキング、ロギング、アナリティクスを実装したり、デバイス機能にアクセスしたりするために使用できる多くのライブラリがすでに利用可能です。詳細については、[この厳選されたリスト](https://github.com/terrakok/kmm-awesome)を参照してください。

## expect/actual関数とプロパティ

Kotlinは、共通ロジックを開発しながらプラットフォーム固有のAPIにアクセスするための言語メカニズムを提供します：[expect/actual宣言](multiplatform-expect-actual.md)。

このメカニズムにより、マルチプラットフォームモジュールの共通ソースセットはexpect宣言を定義し、すべてのプラットフォームソースセットはexpect宣言に対応するactual宣言を提供する必要があります。コンパイラは、共通ソースセットで`expect`キーワードでマークされたすべての宣言が、ターゲットとなるすべてのプラットフォームソースセットで`actual`キーワードでマークされた対応する宣言を持つことを保証します。

これは、関数、クラス、インターフェース、列挙型、プロパティ、アノテーションなど、ほとんどのKotlin宣言で機能します。このセクションでは、expect/actual関数とプロパティの使用に焦点を当てます。

![expect/actual関数とプロパティの使用](expect-functions-properties.svg){width=700}

この例では、共通ソースセットでexpect `platform()`関数を定義し、プラットフォームソースセットでactual実装を提供します。特定のプラットフォームのコードを生成する際、Kotlinコンパイラはexpect宣言とactual宣言をマージします。コンパイラは、そのactual実装を持つ1つの`platform()`関数を生成します。expect宣言とactual宣言は同じパッケージで定義され、結果のプラットフォームコードでは_1つの宣言_にマージされる必要があります。生成されたプラットフォームコード内のexpect `platform()`関数の呼び出しは、正しいactual実装を呼び出します。

### 例: UUIDを生成する

Kotlin Multiplatformを使用してiOSおよびAndroidアプリケーションを開発しており、ユニバーサル一意識別子 (UUID) を生成したいと仮定します。

そのためには、Kotlin Multiplatformモジュールの共通ソースセットで、`expect`キーワードを使ってexpect関数`randomUUID()`を宣言します。実装コードは**含めないでください**。

```kotlin
// In the common source set:
expect fun randomUUID(): String
```

各プラットフォーム固有のソースセット (iOSおよびAndroid) で、共通モジュールで期待される`randomUUID()`関数のactual実装を提供します。これらのactual実装をマークするために、`actual`キーワードを使用します。

![expect/actual宣言でUUIDを生成する](expect-generate-uuid.svg){width=700}

以下のスニペットは、AndroidとiOSの実装を示しています。プラットフォーム固有のコードは、`actual`キーワードと関数に同じ名前を使用します。

```kotlin
// In the android source set:
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// In the iOS source set:
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Androidの実装はAndroidで利用可能なAPIを使用し、iOSの実装はiOSで利用可能なAPIを使用します。
Kotlin/NativeコードからiOS APIにアクセスできます。

Android向けのプラットフォームコードを生成する際、Kotlinコンパイラはexpect宣言とactual宣言を自動的にマージし、Android固有のactual実装を持つ単一の`randomUUID()`関数を生成します。iOSについても同様のプロセスが繰り返されます。

簡潔にするため、この例および以下の例では、簡略化されたソースセット名「common」、「ios」、「android」を使用しています。
通常、これは`commonMain`、`iosMain`、`androidMain`を意味し、同様のロジックはテストソースセットの`commonTest`、`iosTest`、`androidTest`で定義できます。

expect/actual関数と同様に、expect/actualプロパティは、異なるプラットフォームで異なる値を使用することを可能にします。expect/actual関数とプロパティは、単純なケースで最も役立ちます。

## 共通コードのインターフェース

プラットフォーム固有のロジックが大きすぎて複雑な場合は、共通コードでそれを表すインターフェースを定義し、プラットフォームソースセットで異なる実装を提供することで、コードを簡素化できます。

![インターフェースの使用](expect-interfaces.svg){width=700}

プラットフォームソースセットの実装は、対応する依存関係を使用します。

```kotlin
// In the commonMain source set:
interface Platform {
    val name: String
}
```

```kotlin
// In the androidMain source set:
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// In the iosMain source set:
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

共通インターフェースが必要な場合に適切なプラットフォーム実装をインジェクトするには、以下のいずれかのオプションを選択できます。それぞれのオプションについては、以下で詳しく説明します。

* [expect/actual関数を使用する](#expected-and-actual-functions)
* [異なるエントリーポイントを通じて実装を提供する](#different-entry-points)
* [依存性注入 (DI) フレームワークを使用する](#dependency-injection-framework)

### expect/actual関数

このインターフェースの値を返すexpect関数を定義し、次にそのサブクラスを返すactual関数を定義します。

```kotlin
// In the commonMain source set:
interface Platform

expect fun platform(): Platform
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

共通コードで`platform()`関数を呼び出すと、それは`Platform`型のオブジェクトとして機能します。
この共通コードをAndroidで実行すると、`platform()`の呼び出しは`AndroidPlatform`クラスのインスタンスを返します。
iOSで実行すると、`platform()`は`IOSPlatform`クラスのインスタンスを返します。

### 異なるエントリーポイント

エントリーポイントを制御できる場合、expect/actual宣言を使用せずに、各プラットフォームアーティファクトの実装を構築できます。
そのためには、共有Kotlin Multiplatformモジュールでプラットフォーム実装を定義し、それらをプラットフォームモジュールでインスタンス化します。

```kotlin
// Shared Kotlin Multiplatform module
// In the commonMain source set:
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform
```

```kotlin
// In the androidApp platform module:
import android.app.Application
import mysharedpackage.*

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        application(AndroidPlatform())
    }
}
```

```Swift
// In the iosApp platform module (in Swift):
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

Androidでは、`AndroidPlatform`のインスタンスを作成して`application()`関数に渡す必要があります。一方、iOSでは、同様に`IOSPlatform`のインスタンスを作成して渡す必要があります。
これらのエントリーポイントはアプリケーションのエントリーポイントである必要はありませんが、ここが共有モジュールの特定の機能を呼び出すことができる場所です。

expect/actual関数を使用するか、エントリーポイントを通じて直接適切な実装を提供する方法は、単純なシナリオには適しています。
ただし、プロジェクトで依存性注入 (DI) フレームワークを使用している場合は、一貫性を確保するために、単純なケースでもそれを使用することをお勧めします。

### 依存性注入 (DI) フレームワーク

最新のアプリケーションは通常、疎結合アーキテクチャを構築するために、依存性注入 (DI) フレームワークを使用します。
DIフレームワークは、現在の環境に基づいてコンポーネントに依存関係を注入することを可能にします。

Kotlin Multiplatformをサポートする任意のDIフレームワークは、異なるプラットフォームに対して異なる依存関係を注入するのに役立ちます。

例えば、[Koin](https://insert-koin.io/)はKotlin Multiplatformをサポートする依存性注入フレームワークです。

```kotlin
// In the common source set:
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

ここでは、Koin DSLは注入のためのコンポーネントを定義するモジュールを作成します。共通コードで`expect`キーワードを使用してモジュールを宣言し、次に`actual`キーワードを使用して各プラットフォームにプラットフォーム固有の実装を提供します。
フレームワークは、実行時に正しい実装を選択する処理を行います。

DIフレームワークを使用する場合、すべての依存関係をこのフレームワークを通じて注入します。
プラットフォーム依存関係の処理にも同じロジックが適用されます。プロジェクトで既にDIを使用している場合は、expect/actual関数を手動で使用するのではなく、DIを使い続けることをお勧めします。
これにより、2つの異なる依存関係の注入方法を混在させることを避けることができます。

また、常に共通インターフェースをKotlinで実装する必要はありません。
Swiftのような別の言語で、異なる_プラットフォームモジュール_で行うことができます。このアプローチを選択する場合、iOSプラットフォームモジュールからDIフレームワークを使用して実装を提供する必要があります。

![依存性注入フレームワークの使用](expect-di-framework.svg){width=700}

このアプローチは、実装をプラットフォームモジュールに配置する場合にのみ機能します。Kotlin Multiplatformモジュールが自己完結型にならず、別のモジュールで共通インターフェースを実装する必要があるため、スケーラビリティはあまり高くありません。

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 次のステップ

* [KMPアプリでのプラットフォーム固有APIの使用](https://youtu.be/bSNumV04y_w)のビデオウォークスルーをご覧ください。
* expect/actualメカニズムに関するより多くの例と情報については、[expect/actual宣言](multiplatform-expect-actual.md)を参照してください。