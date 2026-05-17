[//]: # (title: FAQ)

## Kotlin Multiplatform

### Kotlin Multiplatform とは何ですか？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) は、柔軟なクロスプラットフォーム開発を目的とした JetBrains によるオープンソース技術です。さまざまなプラットフォーム向けのアプリケーションを作成し、ネイティブプログラミングの利点を維持しながら、それらの間でコードを効率的に再利用することができます。Kotlin Multiplatform を使用すると、Android、iOS、デスクトップ、ウェブ、サーバーサイド、およびその他のプラットフォーム向けのアプリを開発できます。

### Kotlin Multiplatform で UI コードを共有できますか？

はい、Kotlin と [Jetpack Compose](https://developer.android.com/jetpack/compose) をベースとした JetBrains の宣言的 UI フレームワークである [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) を使用して UI を共有できます。このフレームワークを使用すると、iOS、Android、デスクトップ、ウェブなどのプラットフォーム向けの共有 UI コンポーネントを作成でき、異なるデバイスやプラットフォーム間で一貫したユーザーインターフェースを維持するのに役立ちます。

詳細は、[Compose Multiplatform](#compose-multiplatform) のセクションを参照してください。

### Kotlin Multiplatform はどのプラットフォームをサポートしていますか？

Kotlin Multiplatform は、Android、iOS、デスクトップ、ウェブ、サーバーサイド、およびその他のプラットフォームをサポートしています。詳細は、[サポートされているプラットフォーム](supported-platforms.md)を参照してください。

### クロスプラットフォームアプリの開発にはどの IDE を使用すべきですか？

Kotlin Multiplatform プロジェクトでの作業には、IntelliJ IDEA または Android Studio の使用をお勧めします。

Kotlin Multiplatform プロジェクトで iOS をターゲットにする場合は、iOS 固有のコードを記述し iOS アプリケーションを実行するために、マシンに [Xcode](https://developer.apple.com/xcode/) がインストールされている必要があります。

### Kotlin Multiplatform プロジェクトを新規作成するにはどうすればよいですか？

[Kotlin Multiplatform アプリの作成](get-started.topic) チュートリアルでは、Kotlin Multiplatform プロジェクトを作成するためのステップバイステップの手順を説明しています。ロジックのみを共有するか、ロジックと UI の両方を共有するかを決定できます。

### 既存の Android アプリケーションがあります。Kotlin Multiplatform に移行するにはどうすればよいですか？

[Android アプリケーションを iOS で動作させる](multiplatform-integrate-in-existing-app.md) ステップバイステップのチュートリアルでは、既存の Android アプリケーションをネイティブ UI で iOS 上で動作させる方法を説明しています。

[Jetpack Compose アプリを Kotlin Multiplatform に移行する](migrate-from-android.md) は、複雑な Android アプリケーションをマルチプラットフォームに変換する包括的なパス（UI の Compose Multiplatform への移行を含む）を示す高度なチュートリアルです。

### 実際に試せる完全なサンプルはどこにありますか？

[実用的な例のリスト](multiplatform-samples.md)はこちらにあります。

### 実際の Kotlin Multiplatform アプリケーションのリストはどこにありますか？ また、どの企業が本番環境で KMP を使用していますか？

すでに本番環境で Kotlin Multiplatform を採用している他社から学ぶために、[ケーススタディのリスト](https://kotlinlang.org/case-studies/?type=multiplatform)をチェックしてください。

### Kotlin Multiplatform はどのオペレーティングシステムで動作しますか？

iOS を除き、共有コードやプラットフォーム固有のコードを扱う場合は、IDE がサポートしている任意のオペレーティングシステムで作業できます。

iOS 固有のコードを記述し、シミュレーターや実機で iOS アプリケーションを実行したい場合は、macOS を搭載した Mac を使用してください。これは、Apple の要件により、iOS シミュレーターは macOS 上でしか動作せず、Microsoft Windows や Linux などの他のオペレーティングシステムでは動作しないためです。

詳細は、[推奨される IDE](recommended-ides.md) を参照してください。

### Kotlin Multiplatform プロジェクトで並行処理コードを記述するにはどうすればよいですか？

Kotlin Multiplatform プロジェクトでも、コルーチン（coroutines）とフロー（flows）を使用して非同期コードを記述できます。このコードの呼び出し方は、どこから呼び出すかによって異なります。Kotlin コードから中断関数（suspending functions）やフローを呼び出す方法は、特に Android に関して広く文書化されています。[Swift コードからそれらを呼び出す](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers) にはもう少し手間がかかります。詳細は [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610) を参照してください。

現在、Swift から中断関数やフローを呼び出すための最善のアプローチは、[KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) のようなプラグインやライブラリを、Swift の `async`/`await` や Combine、RxSwift などのライブラリと一緒に使用することです。

現時点では、KMP-NativeCoroutines はより実績のあるソリューションであり、`async`/`await`、Combine、RxSwift のアプローチをサポートしています。SKIE はセットアップがより簡単で、記述も簡潔になります。例えば、Kotlin の `Flow` を Swift の `AsyncSequence` に直接マップします。これらのライブラリは両方とも、コルーチンの適切なキャンセルをサポートしています。

使用方法については、[iOS と Android 間でより多くのロジックを共有する](multiplatform-upgrade-app.md) チュートリアルを参照してください。

### Kotlin/Native とは何ですか？ Kotlin Multiplatform とはどのような関係がありますか？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) は、仮想マシンなしで実行できるネイティブバイナリに Kotlin コードをコンパイルするための技術です。これには、Kotlin コンパイラ用の [LLVM ベース](https://llvm.org/) のバックエンドと、Kotlin 標準ライブラリのネイティブ実装が含まれています。

Kotlin/Native は主に、組み込みデバイスや iOS など、仮想マシンが望ましくない、あるいは不可能なプラットフォーム向けのコンパイルを可能にするように設計されています。追加のランタイムや仮想マシンを必要としない自己完結型のプログラムを作成する必要がある場合に特に適しています。

例えばモバイルアプリケーションでは、Kotlin で記述された共有コードは、Kotlin/JVM によって Android 用の JVM バイトコードにコンパイルされ、Kotlin/Native によって iOS 用のネイティブバイナリにコンパイルされます。これにより、両方のプラットフォームで Kotlin Multiplatform とのシームレスな統合が可能になります。

![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png){width=350}

### ネイティブプラットフォーム（iOS、macOS、Linux）向けの Kotlin Multiplatform モジュールのコンパイルを高速化するにはどうすればよいですか？

[Kotlin/Native のコンパイル時間を改善するためのヒント](https://kotlinlang.org/docs/native-improving-compilation-time.html)を参照してください。

## Compose Multiplatform

### Compose Multiplatform とは何ですか？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) は、JetBrains によって開発された最新の宣言的かつリアクティブな UI フレームワークであり、少量の Kotlin コードでユーザーインターフェースを構築する簡単な方法を提供します。また、UI を一度記述すれば、サポートされている任意のプラットフォーム（iOS、Android、デスクトップ（Windows、macOS、Linux）、およびウェブ）で実行することができます。

### Android 用の Jetpack Compose とはどのような関係がありますか？

Compose Multiplatform は、Google が開発した Android UI フレームワークである [Jetpack Compose](https://developer.android.com/jetpack/compose) と API の大部分を共有しています。実際、Compose Multiplatform を使用して Android をターゲットにする場合、アプリは単に Jetpack Compose 上で動作します。
Compose Multiplatform がターゲットとする他のプラットフォームでは、内部の実装詳細が Android の Jetpack Compose とは異なる場合がありますが、提供される API は同じです。

詳細は、[フレームワーク間の相互関係の概要](compose-multiplatform-and-jetpack-compose.md)を参照してください。

### どのプラットフォーム間で UI を共有できますか？

Android、iOS、デスクトップ（Linux、macOS、Windows）、およびウェブ（Wasm ベース）といった一般的なプラットフォームの任意の組み合わせの間で UI を共有できるオプションを提供することを目指しています。Compose Multiplatform は、現時点で Android、iOS、およびデスクトップにおいて安定版（Stable）です。詳細は [サポートされているプラットフォーム](supported-platforms.md) を参照してください。

### Compose Multiplatform は本番環境で使用できますか？

Compose Multiplatform の Android、iOS、およびデスクトップターゲットは安定版（Stable）です。本番環境で使用できます。

WebAssembly（Wasm）ベースの Compose Multiplatform for Web はベータ版（Beta）であり、ほぼ完成していることを意味します。使用することは可能ですが、移行の問題が発生する可能性があります。iOS、Android、デスクトップ向けの Compose Multiplatform と同じ UI を備えています。

### Compose Multiplatform プロジェクトを新規作成するにはどうすればよいですか？

[ロジックと UI を共有した Compose Multiplatform アプリの作成](compose-multiplatform-create-first-app.md) チュートリアルでは、Android、iOS、およびデスクトップ向けの Compose Multiplatform を使用した Kotlin Multiplatform プロジェクトを作成するためのステップバイステップの手順を説明しています。
また、Kotlin デベロッパーアドボケイトの Sebastian Aigner による YouTube の [ビデオチュートリアル](https://www.youtube.com/watch?v=5_W5YKPShZ4) も視聴できます。

### Compose Multiplatform を使用したアプリ構築にはどの IDE を使用すべきですか？

[KMP IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform/)をインストールした IntelliJ IDEA または Android Studio IDE の使用をお勧めします。

詳細は、[推奨される IDE とコードエディタ](recommended-ides.md)を参照してください。

### デモアプリケーションで試すことはできますか？ どこにありますか？

こちらの [サンプル](multiplatform-samples.md) で試すことができます。

### Compose Multiplatform にはウィジェットが付属していますか？

はい、Compose Multiplatform は [Material 3](https://m3.material.io/) ウィジェットをフルサポートしています。

### Material ウィジェットの外観はどの程度カスタマイズできますか？

Material のテーマ機能を使用して、色、フォント、パディングをカスタマイズできます。独自のデザインを作成したい場合は、カスタムウィジェットやレイアウトを作成することも可能です。

### 既存の Kotlin Multiplatform アプリで UI を共有できますか？

アプリケーションが UI にネイティブ API を使用している場合（これが最も一般的なケースです）、Compose Multiplatform はそのための相互運用性（interoperability）を提供しているため、一部を段階的に Compose Multiplatform に書き換えることができます。ネイティブ UI を、Compose で記述された共通 UI をラップする特別なインターオブビュー（interop view）に置き換えることができます。

### Jetpack Compose を使用している既存の Android アプリケーションがあります。他のプラットフォームに移行するには何をすべきですか？

アプリの移行は、UI の移行とロジックの移行の 2 つの部分で構成されます。移行の複雑さは、アプリケーションの複雑さと使用している Android 固有のライブラリの量に依存します。

複雑なアプリの移行例については、[Jetpack Compose アプリを Kotlin Multiplatform に移行する](migrate-from-android.md) ガイドを参照してください。

ほとんどの画面は変更なしで Compose Multiplatform に移行できます。すべての Jetpack Compose ウィジェットがサポートされています。ただし、一部の API は Android ターゲットでしか動作しません。それらは Android 固有であるか、他のプラットフォームにまだ移植されていない可能性があります。例えば、リソースの処理は Android 固有であるため、[Compose Multiplatform リソースライブラリ](compose-multiplatform-resources.md) に移行するか、コミュニティのソリューションを使用する必要があります。
Android でのみ利用可能なコンポーネントの詳細については、現在の [Android 限定 API のリスト](compose-android-only-components.md) を参照してください。

[ビジネスロジックを Kotlin Multiplatform に移行する](multiplatform-integrate-in-existing-app.md) 必要があります。コードを共有モジュールに移動しようとすると、Android 依存関係を使用している部分がコンパイルできなくなるため、それらを書き換える必要があります。

* Android 限定の依存関係を使用しているコードを、代わりにマルチプラットフォームライブラリを使用するように書き換えることができます。一部のライブラリはすでに Kotlin Multiplatform をサポートしている可能性があるため、変更は不要な場合もあります。
  [klibs.io](https://klibs.io/) カタログ、または [KMP-awesome](https://github.com/terrakok/kmp-awesome) ライブラリリストを確認してください。
* あるいは、共通コードをプラットフォーム固有のロジックから分離し、プラットフォームに応じて異なる方法で実装される [共通インターフェースを提供](multiplatform-connect-to-apis.md) することもできます。Android では既存の機能を使用し、iOS などの他のプラットフォームでは共通インターフェースの新しい実装を提供する必要があります。

### 既存の iOS アプリに Compose 画面を統合できますか？

はい。Compose Multiplatform はさまざまな統合シナリオをサポートしています。iOS UI フレームワークとの統合に関する詳細は、[SwiftUI との統合](compose-swiftui-integration.md) および [UIKit との統合](compose-uikit-integration.md) を参照してください。

### UIKit や SwiftUI コンポーネントを Compose 画面に統合できますか？

はい、可能です。[SwiftUI との統合](compose-swiftui-integration.md) および [UIKit との統合](compose-uikit-integration.md) を参照してください。

<!-- Need to revise
### モバイル OS がアップデートされ、新しいプラットフォーム機能が導入された場合はどうなりますか？

Kotlin がそれらをサポートすれば、コードベースのプラットフォーム固有の部分で使用できます。私たちは、次期 Kotlin バージョンでそれらをサポートできるよう最善を尽くしています。すべての新しい Android 機能は Kotlin または Java API を提供し、iOS API のラッパーは自動的に生成されます。
-->

### モバイル OS のアップデートにより、システムコンポーネントの視覚的スタイルや動作が変更された場合はどうなりますか？

すべてのコンポーネントはキャンバス上に描画されるため、OS のアップデート後も UI は同じままです。ネイティブの iOS コンポーネントを画面に埋め込んでいる場合は、アップデートがその外観に影響を与える可能性があります。

## 今後の計画

### Kotlin Multiplatform の進化に関する計画を教えてください。

JetBrains では、マルチプラットフォーム開発において最高の体験を提供し、既存のユーザーの悩みを解消するために多大な投資を行っています。コアとなる Kotlin Multiplatform 技術、Apple エコシステムとの統合、ツール、および Compose Multiplatform UI フレームワークを改善する計画があります。
[Kotlin ロードマップの Multiplatform セクション](https://kotlinlang.org/docs/roadmap.html#kotlin-roadmap-by-subsystem)をチェックしてください。

### Compose Multiplatform はいつ安定版になりますか？

Compose Multiplatform は Android、iOS、およびデスクトップにおいて安定版（Stable）ですが、Wasm ベースのウェブサポートはベータ版（Beta）です。
ウェブプラットフォームの安定版リリースに向けて取り組んでおり、正確な時期は今後発表される予定です。

安定性のステータスに関する詳細は、[サポートされているプラットフォーム](supported-platforms.md) を参照してください。

### Kotlin および Compose Multiplatform におけるウェブターゲットの今後のサポートはどうなりますか？

現在、大きな可能性を秘めている WebAssembly (Wasm) にリソースを集中させています。新しい [Kotlin/Wasm バックエンド](https://kotlinlang.org/docs/wasm-overview.html) および Wasm を活用した [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example) を試すことができます。

JS ターゲットに関しては、Kotlin/JS バックエンドはすでに安定版（Stable）に達しています。Compose Multiplatform では、リソースの制約により、JS Canvas から、より有望であると信じている Wasm に焦点を移しました。

また、以前は Compose Multiplatform for web として知られていた Compose HTML も提供しています。これは Kotlin/JS で DOM を操作するために設計された追加ライブラリであり、プラットフォーム間で UI を共有することを目的としたものではありません。

### マルチプラットフォーム開発用のツールを改善する計画はありますか？

はい、私たちはマルチプラットフォームツールの現在の課題を痛感しており、いくつかの分野で積極的に強化に取り組んでいます。

### Swift との相互運用性（interoperability）を提供する予定はありますか？

はい。現在、Kotlin コードを Swift にエクスポートすることに焦点を当て、Swift との直接的な相互運用性を提供するためのさまざまなアプローチを調査しています。