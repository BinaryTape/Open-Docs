[//]: # (title: よくある質問)

## Kotlin Multiplatform

### Kotlin Multiplatformとは何ですか？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) は、JetBrainsが開発した、柔軟なクロスプラットフォーム開発のためのオープンソース技術です。この技術により、さまざまなプラットフォーム向けのアプリケーションを作成し、ネイティブプログラミングの利点を保ちながら、コードを効率的に再利用できます。Kotlin Multiplatformを使えば、Android、iOS、デスクトップ、ウェブ、サーバーサイド、その他のプラットフォーム向けアプリを開発できます。

### Kotlin MultiplatformでUIを共有できますか？

はい、JetBrainsの宣言型UIフレームワークである[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)を使用することで、UIを共有できます。これはKotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)をベースとしています。このフレームワークにより、iOS、Android、デスクトップ、ウェブなどのプラットフォーム向けに共通のUIコンポーネントを作成し、さまざまなデバイスやプラットフォーム間で一貫したユーザーインターフェースを維持するのに役立ちます。

詳細については、[Compose Multiplatform](#compose-multiplatform)セクションを参照してください。

### Kotlin Multiplatformはどのプラットフォームをサポートしていますか？

Kotlin Multiplatformは、Android、iOS、デスクトップ、ウェブ、サーバーサイド、その他のプラットフォームをサポートしています。詳細については、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### クロスプラットフォームアプリの開発にはどのIDEを使用すべきですか？

Kotlin Multiplatformプロジェクトの開発には、Android Studio IDEを使用することをお勧めします。利用可能な代替案については、[推奨IDEとコードエディタ](recommended-ides.md)で詳しく説明しています。

### 新しいKotlin Multiplatformプロジェクトを作成するにはどうすればよいですか？

[Kotlin Multiplatformアプリの作成](get-started.topic)チュートリアルでは、Kotlin Multiplatformプロジェクトを作成するためのステップバイステップの手順を提供しています。ロジックのみを共有するか、ロジックとUIの両方を共有するかを決定できます。

### 既存のAndroidアプリケーションがありますが、Kotlin Multiplatformに移行するにはどうすればよいですか？

[既存のAndroidアプリケーションをiOSで動作させる](multiplatform-integrate-in-existing-app.md)ステップバイステップチュートリアルでは、AndroidアプリケーションをネイティブUIでiOS上で動作させる方法について説明しています。Compose MultiplatformでUIも共有したい場合は、[対応する回答](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)を参照してください。

### 試せる完全なサンプルはどこで入手できますか？

実践的な[サンプル](multiplatform-samples.md)のリストはこちらです。

### 実践的なKotlin Multiplatformアプリケーションのリストはどこで見つけられますか？どの企業がKMPを本番環境で使用していますか？

Kotlin Multiplatformをすでに本番環境で導入している他社の事例については、[ケーススタディのリスト](case-studies.topic)をご覧ください。

### Kotlin Multiplatformはどのオペレーティングシステムで動作しますか？

iOSを除き、共通コードやプラットフォーム固有のコードで作業する場合は、IDEがサポートする任意のオペレーティングシステムで作業できます。

[推奨IDE](recommended-ides.md)について詳しくはこちら。

iOS固有のコードを記述し、iOSアプリケーションをシミュレータまたは実機で実行したい場合は、macOSを搭載したMacを使用してください。これは、Appleの要件によりiOSシミュレータはmacOS上でのみ動作し、Microsoft WindowsやLinuxなどの他のオペレーティングシステムでは動作しないためです。

### Kotlin Multiplatformプロジェクトで並行コードを記述するにはどうすればよいですか？

Kotlin Multiplatformプロジェクトで非同期コードを記述するには、引き続きコルーチンとフローを使用できます。このコードをどこから呼び出すかによって、呼び出し方は異なります。Kotlinコードからサスペンド関数やフローを呼び出す方法は、特にAndroid向けに広く文書化されています。[Swiftコードからそれらを呼び出す](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)には、もう少し作業が必要です。詳細については、[KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

Swiftからサスペンド関数やフローを呼び出す現在の最善のアプローチは、Swiftの`async`/`await`やCombine、RxSwiftなどのライブラリとともに、[KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)のようなプラグインやライブラリを使用することです。

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

それらの使用方法については、[](multiplatform-upgrade-app.md)を参照してください。

### Kotlin/Nativeとは何ですか？また、Kotlin Multiplatformとの関係はどうなっていますか？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)は、Kotlinコードを仮想マシンなしで実行できるネイティブバイナリにコンパイルするための技術です。これには、Kotlinコンパイラ用の[LLVMベース](https://llvm.org/)のバックエンドと、Kotlin標準ライブラリのネイティブ実装が含まれます。

Kotlin/Nativeは主に、組み込みデバイスやiOSなど、仮想マシンが望ましくない、または不可能なプラットフォーム向けにコンパイルできるように設計されています。追加のランタイムや仮想マシンを必要としない自己完結型のプログラムを生成する必要がある場合に特に適しています。

例えば、モバイルアプリケーションでは、Kotlinで書かれた共通コードは、Android向けにはKotlin/JVMでJVMバイトコードにコンパイルされ、iOS向けにはKotlin/Nativeでネイティブバイナリにコンパイルされます。これにより、両プラットフォームでKotlin Multiplatformとの統合がシームレスになります。

![Kotlin/NativeとKotlin/JVMバイナリ](kotlin-native-and-jvm-binaries.png){width=350}

### ネイティブプラットフォーム (iOS、macOS、Linux) 向けのKotlin Multiplatformモジュールのコンパイルを高速化するにはどうすればよいですか？

[Kotlin/Nativeのコンパイル時間を改善するためのヒント](https://kotlinlang.org/docs/native-improving-compilation-time.html)を参照してください。

## Compose Multiplatform

### Compose Multiplatformとは何ですか？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、JetBrainsが開発した現代的な宣言型およびリアクティブなUIフレームワークであり、少量のKotlinコードでユーザーインターフェースを構築する簡単な方法を提供します。また、一度UIを記述すれば、iOS、Android、デスクトップ (Windows、macOS、Linux)、ウェブなど、サポートされている任意のプラットフォームで実行できます。

### Android向けのJetpack Composeとどのような関係がありますか？

Compose Multiplatformは、Googleが開発したAndroid UIフレームワークである[Jetpack Compose](https://developer.android.com/jetpack/compose)とほとんどのAPIを共有しています。実際、Compose Multiplatformを使用してAndroidをターゲットとする場合、アプリは単にJetpack Compose上で実行されます。Compose Multiplatformがターゲットとする他のプラットフォームでは、内部の実装詳細がAndroidのJetpack Composeとは異なる場合がありますが、それでも同じAPIが提供されます。

詳細については、[フレームワーク間の相互関係の概要](compose-multiplatform-and-jetpack-compose.md)を参照してください。

### どのプラットフォーム間でUIを共有できますか？

人気のプラットフォームであるAndroid、iOS、デスクトップ (Linux、macOS、Windows)、およびウェブ (Wasmベース) の任意の組み合わせでUIを共有するオプションを提供したいと考えています。Compose Multiplatformは現在、Android、iOS、デスクトップのみで安定版です。詳細については、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### Compose Multiplatformを本番環境で使用できますか？

Compose MultiplatformのAndroid、iOS、デスクトップターゲットは安定版です。これらは本番環境で使用できます。

WebAssemblyをベースとしたWeb版Compose Multiplatformはアルファ版であり、活発な開発が進行中です。注意して使用し、移行に関する問題が発生する可能性があることをご承知おきください。UIはiOS、Android、デスクトップ版のCompose Multiplatformと同じです。

### 新しいCompose Multiplatformプロジェクトを作成するにはどうすればよいですか？

[共有ロジックとUIを持つCompose Multiplatformアプリの作成](compose-multiplatform-create-first-app.md)チュートリアルでは、Android、iOS、デスクトップ向けのCompose Multiplatformを使用してKotlin Multiplatformプロジェクトを作成するためのステップバイステップの手順を提供しています。Kotlin開発者アドボケイトのSebastian Aignerが作成したYouTubeの[ビデオチュートリアル](https://www.youtube.com/watch?v=5_W5YKPShZ4)も視聴できます。

### Compose Multiplatformでアプリを構築するにはどのIDEを使用すべきですか？

Android Studio IDEの使用をお勧めします。詳細については、[推奨IDEとコードエディタ](recommended-ides.md)を参照してください。

### デモアプリケーションを試すことはできますか？どこで見つけられますか？

[サンプル](multiplatform-samples.md)をお試しいただけます。

### Compose Multiplatformにはウィジェットが付属していますか？

はい、Compose Multiplatformは[Material 3](https://m3.material.io/)ウィジェットを完全にサポートしています。

### Materialウィジェットの外観はどの程度カスタマイズできますか？

Materialのテーマ設定機能を使用して、色、フォント、パディングをカスタマイズできます。ユニークなデザインを作成したい場合は、カスタムウィジェットやレイアウトを作成できます。

### 既存のKotlin MultiplatformアプリでUIを共有できますか？

アプリケーションがUIにネイティブAPIを使用している場合（これが最も一般的なケースです）、Compose Multiplatformはそれに対応する相互運用性を提供するため、一部を徐々にCompose Multiplatformに書き換えることができます。ネイティブUIを、Composeで記述された共通UIをラップする特別な相互運用ビューに置き換えることができます。

### Jetpack Composeを使用する既存のAndroidアプリケーションがありますが、他のプラットフォームに移行するにはどうすればよいですか？

アプリの移行は、UIの移行とロジックの移行の2つの部分で構成されます。移行の複雑さは、アプリケーションの複雑さと使用しているAndroid固有のライブラリの量に依存します。ほとんどの画面をCompose Multiplatformにそのまま移行できます。Jetpack Composeのウィジェットはすべてサポートされています。ただし、一部のAPIはAndroidターゲットでのみ動作します。これらはAndroid固有であるか、まだ他のプラットフォームに移植されていない可能性があります。例えば、リソースハンドリングはAndroid固有なので、[Compose Multiplatformリソースライブラリ](compose-multiplatform-resources.md)に移行するか、コミュニティソリューションを使用する必要があります。Androidの[Navigationライブラリ](https://developer.android.com/jetpack/androidx/releases/navigation)もAndroid固有ですが、[コミュニティによる代替案](compose-navigation-routing.md)が利用可能です。Androidのみで利用可能なコンポーネントの詳細については、現在の[Android専用APIのリスト](compose-android-only-components.md)を参照してください。

[ビジネスロジックをKotlin Multiplatformに移行する](multiplatform-integrate-in-existing-app.md)必要があります。コードを共有モジュールに移動しようとすると、Android依存関係を使用する部分がコンパイルを停止するため、それらを書き直す必要があります。

*   Android専用の依存関係を使用するコードを、代わりにマルチプラットフォームライブラリを使用するように書き換えることができます。一部のライブラリはすでにKotlin Multiplatformをサポートしているため、変更は不要な場合があります。[KMP-awesome](https://github.com/terrakok/kmp-awesome)ライブラリリストを確認できます。
*   あるいは、共通コードをプラットフォーム固有のロジックから分離し、プラットフォームに応じて異なる実装を持つ[共通インターフェース](multiplatform-connect-to-apis.md)を提供することができます。Androidでは、実装に既存の機能を使用できますが、iOSなどの他のプラットフォームでは、共通インターフェースに新しい実装を提供する必要があります。

### 既存のiOSアプリにCompose画面を統合できますか？

はい、可能です。Compose Multiplatformはさまざまな統合シナリオをサポートしています。iOS UIフレームワークとの統合に関する詳細については、[SwiftUIとの統合](compose-swiftui-integration.md)および[UIKitとの統合](compose-uikit-integration.md)を参照してください。

### UIKitまたはSwiftUIコンポーネントをCompose画面に統合できますか？

はい、できます。[SwiftUIとの統合](compose-swiftui-integration.md)および[UIKitとの統合](compose-uikit-integration.md)を参照してください。

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### モバイルOSが更新され、システムコンポーネントの視覚スタイルや動作が変更された場合、どうなりますか？

OSが更新されても、すべてのコンポーネントはキャンバス上に描画されるため、UIは同じままです。ネイティブiOSコンポーネントを画面に埋め込んでいる場合、更新によってその外観が影響を受ける可能性があります。

## 今後の計画

### Kotlin Multiplatformの進化に関する計画は何ですか？

私たちJetBrainsは、マルチプラットフォーム開発で最高の体験を提供し、既存のマルチプラットフォームユーザーが抱える課題を解消するために多大な投資を行っています。コアとなるKotlin Multiplatform技術、Appleエコシステムとの統合、ツール、そしてCompose Multiplatform UIフレームワークの改善計画があります。[私たちのロードマップ](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)をご覧ください。

### Compose Multiplatformはいつ安定版になりますか？

Compose MultiplatformはAndroid、iOS、デスクトップ向けには安定版ですが、ウェブプラットフォームのサポートはアルファ版です。ウェブプラットフォームの安定版リリースに向けて取り組んでおり、正確な日付は追って発表されます。

安定性ステータスの詳細については、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### KotlinおよびCompose Multiplatformにおけるウェブターゲットの今後のサポートはどうなりますか？

現在、WebAssembly (Wasm) にリソースを集中しており、大きな可能性を秘めていると考えています。新しい[Kotlin/Wasmバックエンド](https://kotlinlang.org/docs/wasm-overview.html)と、Wasmを搭載した[ウェブ向けCompose Multiplatform](https://kotl.in/wasm-compose-example)を試すことができます。

JSターゲットに関しては、Kotlin/JSバックエンドはすでに安定版のステータスに達しています。Compose Multiplatformでは、リソースの制約により、JS CanvasからWasmへと焦点を移しました。Wasmの方がより有望だと考えています。

また、以前はウェブ向けCompose Multiplatformとして知られていたCompose HTMLも提供しています。これはKotlin/JSでDOMを操作するために設計された追加ライブラリであり、プラットフォーム間でUIを共有することを目的としたものではありません。

### マルチプラットフォーム開発のツールを改善する計画はありますか？

はい、マルチプラットフォームツールの現在の課題を強く認識しており、いくつかの分野で積極的に改善に取り組んでいます。

### Swiftとの相互運用性を提供する予定はありますか？

はい。現在、Swiftとの直接的な相互運用性を提供するためのさまざまなアプローチを調査しており、KotlinコードをSwiftにエクスポートすることに重点を置いています。