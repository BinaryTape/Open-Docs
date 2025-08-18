[//]: # (title: プラットフォーム固有のAPIの使用)

この記事では、マルチプラットフォームアプリケーションとライブラリを開発する際に、プラットフォーム固有のAPIを使用する方法を学びます。

## Kotlinマルチプラットフォームライブラリ

プラットフォーム固有のAPIを使用するコードを記述する前に、代わりにマルチプラットフォームライブラリを使用できるかどうかを確認してください。
この種のライブラリは、異なるプラットフォーム向けに異なる実装を持つ共通Kotlin APIを提供します。

ネットワーキング、ロギング、アナリティクスを実装したり、デバイス機能にアクセスしたりするために使用できる多くのライブラリがすでに利用可能です。
詳細については、[このキュレーションされたリスト](https://github.com/terrakok/kmm-awesome)を参照してください。

## expected および actual 関数とプロパティ

Kotlinは、共通ロジックを開発する際にプラットフォーム固有のAPIにアクセスするための言語メカニズムを提供します。[expected および actual 宣言](multiplatform-expect-actual.md)です。

このメカニズムにより、マルチプラットフォームモジュールの共通ソースセットは`expected`宣言を定義し、各プラットフォームソースセットは`expected`宣言に対応する`actual`宣言を提供する必要があります。コンパイラは、共通ソースセットで`expect`キーワードでマークされたすべての宣言が、対象となるすべてのプラットフォームソースセットで`actual`キーワードでマークされた対応する宣言を持つことを保証します。

これは、関数、クラス、インターフェース、列挙型、プロパティ、アノテーションなど、ほとんどのKotlin宣言に適用されます。このセクションでは、`expected` および `actual` 関数とプロパティの使用に焦点を当てます。

![Expected および actual 関数とプロパティの使用](expect-functions-properties.svg){width=700}

この例では、共通ソースセットで`expected`な`platform()`関数を定義し、プラットフォームソースセットで`actual`な実装を提供します。特定のプラットフォームのコードを生成する際、Kotlinコンパイラは`expected` および `actual` 宣言をマージします。その`actual`な実装を持つ1つの`platform()`関数が生成されます。`expected` および `actual` 宣言は同じパッケージで定義され、結果として生成されるプラットフォームコードでは_1つの宣言_にマージされる必要があります。生成されたプラットフォームコードにおける`expected`な`platform()`関数の任意の呼び出しは、正しい`actual`な実装を呼び出します。

### 例: UUIDの生成

Kotlin Multiplatformを使用してiOSおよびAndroidアプリケーションを開発しており、universally unique identifier (UUID) を生成したいと仮定しましょう。

そのためには、Kotlin Multiplatformモジュールの共通ソースセットで、`expect`キーワードを使用して`randomUUID()`関数を`expected`として宣言します。実装コードを**含めないでください**。

```kotlin
// 共通ソースセット内:
expect fun randomUUID(): String
```

各プラットフォーム固有のソースセット（iOSとAndroid）で、共通モジュールで`expected`とされる`randomUUID()`関数の`actual`な実装を提供します。これらの`actual`な実装をマークするために`actual`キーワードを使用します。

![expected および actual 宣言によるUUIDの生成](expect-generate-uuid.svg){width=700}

次のスニペットは、AndroidとiOSの実装を示しています。プラットフォーム固有のコードは`actual`キーワードを使用し、関数に同じ名前を使用します。

```kotlin
// Androidソースセット内:
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// iOSソースセット内:
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Androidの実装はAndroidで利用可能なAPIを使用し、iOSの実装はiOSで利用可能なAPIを使用します。
Kotlin/NativeコードからiOS APIにアクセスできます。

Android向けの最終的なプラットフォームコードを生成する際、Kotlinコンパイラは`expected` および `actual` 宣言を自動的にマージし、`actual`なAndroid固有の実装を持つ単一の`randomUUID()`関数を生成します。同じプロセスがiOSでも繰り返されます。

簡潔にするため、この例および以下の例では、「common」、「ios」、「android」という簡略化されたソースセット名を使用します。
通常、これは`commonMain`、`iosMain`、`androidMain`を意味し、同様のロジックはテストソースセットである`commonTest`、`iosTest`、`androidTest`でも定義できます。

`expected` および `actual` 関数と同様に、`expected` および `actual` プロパティを使用すると、異なるプラットフォームで異なる値を使用できます。`expected` および `actual` 関数とプロパティは、シンプルなケースで最も役立ちます。

## 共通コード内のインターフェース

プラットフォーム固有のロジックが大きすぎて複雑な場合、共通コードでそれを表すインターフェースを定義し、その後プラットフォームソースセットで異なる実装を提供することで、コードを簡素化できます。

![インターフェースの使用](expect-interfaces.svg){width=700}

プラットフォームソースセットの実装は、それぞれの対応する依存関係を使用します。

```kotlin
// commonMain ソースセット内:
interface Platform {
    val name: String
}
```

```kotlin
// androidMain ソースセット内:
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// iosMain ソースセット内:
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

共通インターフェースが必要な場合に適切なプラットフォーム実装を注入するには、以下のいずれかのオプションを選択できます。それぞれのオプションは、以下でさらに詳しく説明します。

* [`expected` および `actual` 関数の使用](#expected-and-actual-functions)
* [異なるエントリポイントによる実装の提供](#different-entry-points)
* [依存性注入フレームワークの使用](#dependency-injection-framework)

### expected および actual 関数

このインターフェースの値を返す`expected`関数を定義し、そのサブクラスを返す`actual`関数を定義します。

```kotlin
// commonMain ソースセット内:
interface Platform

expect fun platform(): Platform
```

```kotlin
// androidMain ソースセット内:
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// iosMain ソースセット内:
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

共通コードで`platform()`関数を呼び出すと、`Platform`型のオブジェクトを扱えます。
この共通コードをAndroidで実行すると、`platform()`の呼び出しは`AndroidPlatform`クラスのインスタンスを返します。
iOSで実行すると、`platform()`は`IOSPlatform`クラスのインスタンスを返します。

### 異なるエントリポイント

エントリポイントを制御する場合、`expected` および `actual` 宣言を使用せずに各プラットフォーム成果物の実装を構築できます。
そのためには、プラットフォーム実装を共有Kotlin Multiplatformモジュールで定義しますが、それらをプラットフォームモジュールでインスタンス化します。

```kotlin
// 共有Kotlin Multiplatformモジュール
// commonMain ソースセット内:
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// androidMain ソースセット内:
class AndroidPlatform : Platform
```

```kotlin
// iosMain ソースセット内:
class IOSPlatform : Platform
```

```kotlin
// androidApp プラットフォームモジュール内:
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
// iosApp プラットフォームモジュール内 (Swift):
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

Androidでは、`AndroidPlatform`のインスタンスを作成して`application()`関数に渡す必要があります。一方iOSでは、同様に`IOSPlatform`のインスタンスを作成して渡す必要があります。これらのエントリポイントはアプリケーションのエントリポイントである必要はありませんが、ここで共有モジュールの特定の機能を呼び出すことができます。

`expected` および `actual` 関数を使用するか、またはエントリポイントを直接介して適切な実装を提供する方法は、シンプルなシナリオにはうまく機能します。
しかし、プロジェクトで依存性注入フレームワークを使用している場合、一貫性を確保するためにシンプルなケースでもそれを使用することをお勧めします。

### 依存性注入フレームワーク

最新のアプリケーションは通常、疎結合アーキテクチャを構築するために依存性注入 (DI) フレームワークを使用します。
DIフレームワークは、現在の環境に基づいてコンポーネントに依存関係を注入できます。

Kotlin Multiplatformをサポートする任意のDIフレームワークは、異なるプラットフォーム向けに異なる依存関係を注入するのに役立ちます。

例えば、[Koin](https://insert-koin.io/)はKotlin Multiplatformをサポートする依存性注入フレームワークです。

```kotlin
// 共通ソースセット内:
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// androidMain ソースセット内:
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// iosMain ソースセット内:
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

ここでは、Koin DSLが注入するコンポーネントを定義するモジュールを作成します。共通コードで`expect`キーワードを使用してモジュールを宣言し、その後`actual`キーワードを使用して各プラットフォーム向けにプラットフォーム固有の実装を提供します。フレームワークが実行時に正しい実装を選択する役割を担います。

DIフレームワークを使用する場合、すべての依存関係をこのフレームワークを介して注入します。同じロジックがプラットフォーム依存関係の処理にも適用されます。プロジェクトにDIをすでに導入している場合は、`expected` および `actual` 関数を手動で使用するよりも、DIを継続して使用することをお勧めします。この方法により、依存関係を注入する2つの異なる方法を混在させることを避けられます。

また、共通インターフェースを常にKotlinで実装する必要はありません。Swiftのような別の言語で、異なる_プラットフォームモジュール_で行うこともできます。このアプローチを選択する場合、DIフレームワークを使用してiOSプラットフォームモジュールから実装を提供する必要があります。

![依存性注入フレームワークの使用](expect-di-framework.svg){width=700}

このアプローチは、実装をプラットフォームモジュールに配置した場合にのみ機能します。Kotlin Multiplatformモジュールが自己完結型にならないため、あまりスケーラブルではありません。共通インターフェースを別のモジュールで実装する必要があるためです。

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 次のステップ

* [KMPアプリでのプラットフォーム固有APIの使用](https://youtu.be/bSNumV04y_w)のビデオチュートリアルをご覧ください。
* `expect`/`actual`メカニズムに関するさらに多くの例と情報については、[expected および actual 宣言](multiplatform-expect-actual.md)を参照してください。