[//]: # (title: よくある質問)

## Kotlin Multiplatformについて

### Kotlin Multiplatformとは何ですか？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP)は、JetBrainsが提供する柔軟なクロスプラットフォーム開発のためのオープンソース技術です。様々なプラットフォーム向けのアプリケーションを作成し、ネイティブプログラミングの利点を維持しながら、コードを効率的に再利用できます。Kotlin Multiplatformを使用すると、Android、iOS、デスクトップ、ウェブ、サーバーサイド、その他のプラットフォーム向けにアプリを開発できます。

### Kotlin MultiplatformでUIを共有できますか？

はい、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)をベースにしたJetBrainsの宣言型UIフレームワークである[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)を使用してUIを共有できます。このフレームワークを使用すると、iOS、Android、デスクトップ、ウェブなどのプラットフォーム向けに共通のUIコンポーネントを作成でき、様々なデバイスやプラットフォーム間で一貫したユーザーインターフェースを維持するのに役立ちます。

詳細については、[Compose Multiplatform](#compose-multiplatform)セクションを参照してください。

### Kotlin Multiplatformはどのプラットフォームをサポートしていますか？

Kotlin Multiplatformは、Android、iOS、デスクトップ、ウェブ、サーバーサイド、その他のプラットフォームをサポートしています。[サポートされているプラットフォーム](supported-platforms.md)について、さらに詳しく学習してください。

### クロスプラットフォームアプリはどのIDEで作業すべきですか？

Kotlin Multiplatformプロジェクトでの作業には、Android Studio IDEを使用することをお勧めします。[推奨IDEおよびコードエディター](recommended-ides.md)で利用可能な代替手段について詳しくお読みください。

### 新しいKotlin Multiplatformプロジェクトを作成するにはどうすればよいですか？

[Kotlin Multiplatformアプリの作成](get-started.topic)チュートリアルでは、Kotlin Multiplatformプロジェクトを作成するためのステップバイステップの手順を提供しています。ロジックのみを共有するか、ロジックとUIの両方を共有するかを決定できます。

### 既存のAndroidアプリケーションがあります。Kotlin Multiplatformに移行するにはどうすればよいですか？

[AndroidアプリケーションをiOSで動作させる](multiplatform-integrate-in-existing-app.md)ステップバイステップチュートリアルでは、ネイティブUIでAndroidアプリケーションをiOSで動作させる方法を説明しています。Compose MultiplatformでUIも共有したい場合は、[対応する回答](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)を参照してください。

### 試せる完全な例はどこで入手できますか？

[実際の例のリスト](multiplatform-samples.md)はこちらです。

### 実際のKotlin Multiplatformアプリケーションのリストはどこで見つけられますか？どの企業が本番環境でKMPを使用していますか？

[ケーススタディのリスト](case-studies.topic)を確認して、すでに本番環境でKotlin Multiplatformを採用している他の企業から学びましょう。

### Kotlin Multiplatformはどのオペレーティングシステムで動作しますか？

iOSを除き、共有コードまたはプラットフォーム固有のコードで作業する場合は、IDEがサポートする任意のオペレーティングシステムで作業できます。

[推奨IDE](recommended-ides.md)について、さらに詳しく学習してください。

iOS固有のコードを記述し、シミュレーターまたは実機でiOSアプリケーションを実行したい場合は、macOS搭載のMacを使用してください。これは、Appleの要件によりiOSシミュレーターがmacOSでのみ実行可能であり、Microsoft WindowsやLinuxなどの他のオペレーティングシステムでは実行できないためです。

### Kotlin Multiplatformプロジェクトで並行処理コードを記述するにはどうすればよいですか？

Kotlin Multiplatformプロジェクトでは、コルーチンとフローを使用して非同期コードを記述できます。このコードの呼び出し方法は、どこからコードを呼び出すかによって異なります。Kotlinコードからサスペンド関数とフローを呼び出す方法は、特にAndroid向けに広くドキュメント化されています。[Swiftコードからそれらを呼び出す](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)には、もう少し作業が必要です。詳細については[KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

Swiftからサスペンド関数とフローを呼び出すための現在の最善のアプローチは、Swiftの`async`/`await`やCombineおよびRxSwiftのようなライブラリと組み合わせて、[KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)のようなプラグインやライブラリを使用することです。

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

それらの使用方法については、[iOSとAndroid間でより多くのロジックを共有する](multiplatform-upgrade-app.md)を参照してください。

### Kotlin/Nativeとは何ですか？Kotlin Multiplatformとの関係はどうですか？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)は、Kotlinコードを仮想マシンなしで実行できるネイティブバイナリにコンパイルするための技術です。これには、Kotlinコンパイラの[LLVMベース](https://llvm.org/)のバックエンドと、Kotlin標準ライブラリのネイティブ実装が含まれます。

Kotlin/Nativeは、主に組み込みデバイスやiOSのように、仮想マシンが望ましくない、または利用できないプラットフォームでのコンパイルを可能にするために設計されています。追加のランタイムや仮想マシンを必要としない自己完結型のプログラムを生成する必要がある場合に特に適しています。

例えば、モバイルアプリケーションでは、Kotlinで記述された共有コードは、Android向けにはKotlin/JVMでJVMバイトコードにコンパイルされ、iOS向けにはKotlin/Nativeでネイティブバイナリにコンパイルされます。これにより、両方のプラットフォームでKotlin Multiplatformとの統合がシームレスになります。

![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png){width=350}

### ネイティブプラットフォーム（iOS、macOS、Linux）向けのKotlin Multiplatformモジュールのコンパイルを高速化するにはどうすればよいですか？

[Kotlin/Nativeのコンパイル時間を改善するためのヒント](https://kotlinlang.org/docs/native-improving-compilation-time.html)を参照してください。

## Compose Multiplatformについて

### Compose Multiplatformとは何ですか？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、JetBrainsが開発したモダンな宣言型およびリアクティブUIフレームワークであり、少量のKotlinコードでユーザーインターフェースを構築する簡単な方法を提供します。また、UIを一度記述するだけで、サポートされている任意のプラットフォーム（iOS、Android、デスクトップ（Windows、macOS、Linux）、およびウェブ）で実行できます。

### Android向けJetpack Composeとどのような関係がありますか？

Compose Multiplatformは、Googleが開発したAndroid UIフレームワークである[Jetpack Compose](https://developer.android.com/jetpack/compose)とほとんどのAPIを共有しています。実際、Compose Multiplatformを使用してAndroidをターゲットとする場合、アプリは単純にJetpack Compose上で動作します。Compose Multiplatformがターゲットとする他のプラットフォームは、Android上のJetpack Composeとは異なる内部実装の詳細を持つ場合がありますが、それでも同じAPIを提供します。

詳細については、[フレームワーク間の相互関係の概要](compose-multiplatform-and-jetpack-compose.md)を参照してください。

### どのプラットフォーム間でUIを共有できますか？

Android、iOS、デスクトップ（Linux、macOS、Windows）、ウェブ（Wasmベース）といった人気のプラットフォームの任意の組み合わせ間でUIを共有するオプションを提供したいと考えています。Compose Multiplatformは現時点ではAndroid、iOS、デスクトップでのみStableです。詳細については、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### Compose Multiplatformを本番環境で使用できますか？

Compose MultiplatformのAndroid、iOS、デスクトップターゲットはStableです。これらは本番環境で使用できます。

WebAssemblyをベースとしたWeb版のCompose MultiplatformはAlpha段階であり、活発に開発中であることを意味します。注意して使用し、移行に関する問題が発生する可能性があります。これは、iOS、Android、デスクトップ向けのCompose Multiplatformと同じUIを持っています。

### 新しいCompose Multiplatformプロジェクトを作成するにはどうすればよいですか？

[共通ロジックとUIを持つCompose Multiplatformアプリを作成する](compose-multiplatform-create-first-app.md)チュートリアルでは、Android、iOS、デスクトップ向けのCompose Multiplatformを使用してKotlin Multiplatformプロジェクトを作成するためのステップバイステップの手順を提供します。また、Kotlin Developer AdvocateのSebastian Aignerが作成した[YouTubeのビデオチュートリアル](https://www.youtube.com/watch?v=5_W5YKPShZ4)を視聴することもできます。

### Compose Multiplatformでアプリを構築するためにどのIDEを使用すべきですか？

Android Studio IDEの使用をお勧めします。詳細については、[推奨IDEおよびコードエディター](recommended-ides.md)を参照してください。

### デモアプリケーションを試すことはできますか？どこで見つけられますか？

[サンプル](multiplatform-samples.md)を試すことができます。

### Compose Multiplatformにはウィジェットが付属していますか？

はい、Compose Multiplatformは[Material 3](https://m3.material.io/)ウィジェットを完全にサポートしています。

### Materialウィジェットの外観はどの程度カスタマイズできますか？

Materialのテーマ設定機能を使用して、色、フォント、パディングをカスタマイズできます。ユニークなデザインを作成したい場合は、カスタムウィジェットとレイアウトを作成できます。

### 既存のKotlin MultiplatformアプリでUIを共有できますか？

アプリケーションがUIにネイティブAPIを使用している場合（これが最も一般的なケースです）、Compose Multiplatformにはそのための相互運用性があるため、一部を徐々にCompose Multiplatformに書き換えることができます。ネイティブUIを、Composeで記述された共通UIをラップする特別な相互運用ビューに置き換えることができます。

### Jetpack Composeを使用する既存のAndroidアプリケーションがあります。他のプラットフォームに移行するにはどうすればよいですか？

アプリの移行は、UIの移行とロジックの移行の2つの部分で構成されます。移行の複雑さは、アプリケーションの複雑さと使用しているAndroid固有ライブラリの量によって異なります。ほとんどの画面をCompose Multiplatformにそのまま移行できます。すべてのJetpack Composeウィジェットがサポートされています。ただし、一部のAPIはAndroidターゲットでのみ動作します。これらはAndroid固有であるか、他のプラットフォームにまだ移植されていない可能性があります。たとえば、リソース処理はAndroid固有であるため、[Compose Multiplatformリソースライブラリ](compose-multiplatform-resources.md)に移行するか、コミュニティソリューションを使用する必要があります。Androidの[Navigationライブラリ](https://developer.android.com/jetpack/androidx/releases/navigation)もAndroid固有ですが、[コミュニティの代替手段](compose-navigation-routing.md)が利用可能です。Androidでのみ利用可能なコンポーネントの詳細については、現在の[Android専用APIのリスト](compose-android-only-components.md)を参照してください。

ビジネスロジックを[Kotlin Multiplatformに移行する](multiplatform-integrate-in-existing-app.md)必要があります。コードを共有モジュールに移動しようとすると、Android依存関係を使用している部分がコンパイルされなくなり、それらを書き直す必要があります。

*   Android専用の依存関係を使用するコードを、代わりにマルチプラットフォームライブラリを使用するように書き換えることができます。一部のライブラリはすでにKotlin Multiplatformをサポートしているため、変更は不要です。[KMP-awesome](https://github.com/terrakok/kmp-awesome)ライブラリリストを確認できます。
*   あるいは、共通コードをプラットフォーム固有のロジックから分離し、プラットフォームに応じて異なる実装を持つ[共通インターフェースを提供する](multiplatform-connect-to-apis.md)ことができます。Androidでは、実装は既存の機能を使用でき、iOSなどの他のプラットフォームでは、共通インターフェースの新しい実装を提供する必要があります。

### 既存のiOSアプリにCompose画面を統合できますか？

はい。Compose Multiplatformは様々な統合シナリオをサポートしています。iOS UIフレームワークとの統合に関する詳細については、[SwiftUIとの統合](compose-swiftui-integration.md)および[UIKitとの統合](compose-uikit-integration.md)を参照してください。

### UIKitまたはSwiftUIコンポーネントをCompose画面に統合できますか？

はい、可能です。[SwiftUIとの統合](compose-swiftui-integration.md)および[UIKitとの統合](compose-uikit-integration.md)を参照してください。

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### モバイルOSがアップデートされ、システムコンポーネントの視覚スタイルや動作が変更された場合、どうなりますか？

すべてのコンポーネントはキャンバス上に描画されるため、OSアップデート後もUIは同じままです。画面にネイティブのiOSコンポーネントを埋め込む場合、アップデートがそれらの外観に影響を与える可能性があります。

## 将来の計画

### Kotlin Multiplatformの進化に関する計画は何ですか？

JetBrainsでは、マルチプラットフォーム開発で最高の体験を提供し、既存のマルチプラットフォームユーザーの悩みを解消するために多大な投資を行っています。コアとなるKotlin Multiplatformテクノロジー、Appleエコシステムとの統合、ツール、およびCompose Multiplatform UIフレームワークの改善計画があります。[私たちのロードマップ](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)をご確認ください。

### Compose MultiplatformはいつStableになりますか？

Compose MultiplatformはAndroid、iOS、デスクトップではStableですが、ウェブプラットフォームのサポートはAlpha段階です。ウェブプラットフォームの安定版リリースに向けて取り組んでおり、正確な日付は追って発表されます。

安定性のステータスの詳細については、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### KotlinおよびCompose Multiplatformにおけるウェブターゲットの今後のサポートはどうなりますか？

現在、大きな可能性を秘めているWebAssembly（Wasm）にリソースを集中しています。新しい[Kotlin/Wasmバックエンド](https://kotlinlang.org/docs/wasm-overview.html)と、Wasmを搭載した[Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)を試すことができます。

JSターゲットに関しては、Kotlin/JSバックエンドはすでにStableステータスに達しています。Compose Multiplatformでは、リソースの制約により、JS CanvasからWasmへと焦点を移しました。Wasmの方がより有望であると考えています。

また、以前はCompose Multiplatform for webとして知られていたCompose HTMLも提供しています。これはKotlin/JSでDOMを操作するために設計された追加ライブラリであり、プラットフォーム間でUIを共有するためのものではありません。

### マルチプラットフォーム開発のツールを改善する計画はありますか？

はい、マルチプラットフォームツールにおける現在の課題を強く認識しており、いくつかの領域で改善に積極的に取り組んでいます。

### Swiftの相互運用性を提供する予定はありますか？

はい。現在、Swiftとの直接的な相互運用性を提供するための様々なアプローチを調査しており、特にKotlinコードをSwiftにエクスポートすることに焦点を当てています。