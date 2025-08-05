# Kotlin MultiplatformとFlutter: クロスプラットフォーム開発ソリューション

<web-summary>この記事では、Kotlin MultiplatformとFlutterを探求し、それらの機能と、クロスプラットフォームプロジェクトに最適なものを選択するのに役立ちます。</web-summary> 

急速に進化するテクノロジーの世界において、開発者は高品質なアプリケーションを構築するための効率的なフレームワークやツールを常に探しています。しかし、利用可能な選択肢の中から選ぶ際には、いわゆる「最善の選択肢」を見つけることに過度に重点を置くのを避けることが重要です。なぜなら、このアプローチが常に最も適した選択肢につながるとは限らないからです。

各プロジェクトは固有であり、特定の要件を持っています。この記事は、Kotlin MultiplatformやFlutterのような技術があなたのプロジェクトに最も適しているかを理解し、情報に基づいた意思決定を行うのに役立つことを目指しています。

## クロスプラットフォーム開発: 最新のアプリケーション構築への統一されたアプローチ

クロスプラットフォーム開発は、単一のコードベースで複数のプラットフォームで動作するアプリケーションを構築する方法を提供し、各システムで同じ機能を書き直す必要をなくします。しばしば[モバイル開発](cross-platform-mobile-development.md)（AndroidとiOSの両方をターゲットとする）と関連付けられますが、このアプローチはモバイルをはるかに超え、ウェブ、デスクトップ、さらにはサーバーサイド環境までカバーします。

中心となるアイデアは、コードの再利用を最大化しつつ、必要に応じてプラットフォーム固有の機能を実装できることを保証することであり、これにより開発プロセスを効率化し、メンテナンス作業を削減します。チームは開発サイクルを加速させ、コストを削減し、プラットフォーム間での一貫性を確保できるため、今日のますます多様化するアプリケーションの状況において、クロスプラットフォーム開発は賢明な選択肢となっています。

## Kotlin MultiplatformとFlutter: プラットフォームを横断した開発の効率化

FlutterとKotlin Multiplatformは、異なるプラットフォーム間でのアプリケーション開発を簡素化する2つの人気のあるクロスプラットフォーム技術です。

### Flutter

[Flutter](https://flutter.dev/)は、単一のコードベースからネイティブにコンパイルされたマルチプラットフォームアプリケーションを構築するためのオープンソースフレームワークです。Android、iOS、ウェブ、デスクトップ（Windows、macOS、Linux）、組み込みシステムといった多様なプラットフォームで、すべて単一の共有アプリコードベースから豊かなアプリ体験を作成できます。FlutterアプリはDartプログラミング言語を使用して記述されます。FlutterはGoogleによってサポートされ、使用されています。

2014年にSkyという名前で初めて導入され、[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/)は2018年12月にFlutter Liveで正式に発表されました。

Flutter開発者コミュニティは大規模で非常に活発であり、継続的な改善とサポートを提供しています。Flutterでは、FlutterおよびDartエコシステム内の開発者によって貢献された共有パッケージを利用できます。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/)（KMP）はJetBrainsによって構築されたオープンソース技術で、開発者はAndroid、iOS、ウェブ、デスクトップ（Windows、macOS、Linux）、およびサーバーサイド向けにアプリケーションを作成でき、これらのプラットフォーム間でKotlinコードを効率的に再利用しながら、ネイティブプログラミングの利点を保持できます。

Kotlin Multiplatformを使用すると、さまざまなオプションがあります。アプリのエントリポイントを除くすべてのコードを共有したり、単一のロジック（ネットワークモジュールやデータベースモジュールなど）を共有したり、UIをネイティブに保ちながらビジネスロジックを共有したりできます。

![Kotlin Multiplatform は最大100%のコードを再利用できる技術です](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatformは、2017年のKotlin 1.2の一部として初めて導入されました。2023年11月には、Kotlin Multiplatformが[安定版になりました](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。Google I/O 2024では、GoogleがAndroid上で[Kotlin Multiplatformのサポート](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)を発表しました。これはAndroidとiOS間でビジネスロジックを共有するためのものです。

[![Kotlin Multiplatform を発見する](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)を使用すると、複数のプラットフォーム間で共有UIコードを記述できます。これはJetBrainsによる最新の宣言型フレームワークで、Kotlin MultiplatformとGoogleのJetpack Composeをベースに構築されています。

Compose Multiplatformは現在、[iOS](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)、Android、デスクトップで安定版であり、ウェブではアルファ版です。

[![Compose Multiplatform を探索する](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

私たちの専門記事では、[Compose Multiplatform と Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)の関係性を概説し、主な違いを強調しています。

### Kotlin MultiplatformとFlutter: 概要

<table style="both">
    <tr>
        <td></td>
        <td><b>Kotlin Multiplatform</b></td>
        <td><b>Flutter</b></td>
    </tr>
    <tr>
        <td><b>作成者</b></td>
        <td>JetBrains</td>
        <td>Google</td>
    </tr>
    <tr>
        <td><b>言語</b></td>
        <td>Kotlin</td>
        <td>Dart</td>
    </tr>
    <tr>
        <td><b>柔軟性とコード再利用</b></td>
        <td>ビジネスロジックやUIを含む、コードベースの必要な部分を1%から100%まで共有できます。</td>
        <td>アプリケーションのあらゆるピクセルを制御し、すべてのプラットフォームで100%のコード共有により、カスタマイズされた適応性の高いデザインを作成できます。</td>
    </tr>
    <tr>
        <td><b>パッケージ、依存関係、エコシステム</b></td>
        <td>パッケージは<a href="https://central.sonatype.com/">Maven Central</a>およびその他のリポジトリから入手可能です。
            <p><a href="http://klibs.io">klibs.io</a>（アルファ版）は、KMPライブラリの検索を簡素化するように設計されています。</p>
            <p>この<a href="https://github.com/terrakok/kmp-awesome">リスト</a>には、最も人気のあるKMPライブラリとツールの一部が含まれています。</p> </td>
        <td>パッケージは<a href="https://pub.dev/">Pub.dev</a>から入手可能です。</td>
    </tr>
    <tr>
        <td><b>ビルドツール</b></td>
        <td>Gradle（Appleデバイスをターゲットとするアプリケーションの場合はXcodeも）。</td>
        <td>Flutterコマンドラインツール（内部でGradleとXcodeを使用）。</td>
    </tr>
    <tr>
        <td><b>コード共有</b></td>
        <td>Android、iOS、ウェブ、デスクトップ、サーバーサイド。</td>
        <td>Android、iOS、ウェブ、デスクトップ、組み込みデバイス。</td>
    </tr>
    <tr>
        <td><b>コンパイル</b></td>
        <td>デスクトップとAndroidではJVMバイトコードに、ウェブではJavaScriptまたはWasmに、ネイティブプラットフォームではプラットフォーム固有のバイナリにコンパイルされます。</td>
        <td>デバッグビルドはDartコードを仮想マシンで実行します。
        <p>リリースビルドは、ネイティブプラットフォーム向けにプラットフォーム固有のバイナリを、ウェブ向けにJavaScript/Wasmを出力します。</p>
        </td>
    </tr>
    <tr>
        <td><b>ネイティブAPIとの通信</b></td>
        <td>ネイティブAPIは、<a href="multiplatform-expect-actual.md">expect/actual宣言</a>を使用してKotlinコードから直接アクセスできます。</td>
        <td>ホストプラットフォームとの通信は、<a href="https://docs.flutter.dev/platform-integration/platform-channels">プラットフォームチャネル</a>を使用して可能です。</td>
    </tr>
    <tr>
        <td><b>UIレンダリング</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a>を使用すると、GoogleのJetpack ComposeをベースにしたSkiaエンジン（OpenGL、ANGLE（OpenGL ES 2または3の呼び出しをネイティブAPIに変換）、Vulkan、Metalと互換性あり）を使用してUIをプラットフォーム間で共有できます。</td>
        <td>Flutterウィジェットは、カスタムの<a href="https://docs.flutter.dev/perf/impeller">Impellerエンジン</a>を使用して画面にレンダリングされます。Impellerエンジンは、プラットフォームとデバイスに応じてMetal、Vulkan、またはOpenGLを使用してGPUと直接通信します。</td>
    </tr>
    <tr>
        <td><b>UI開発のイテレーション</b></td>
        <td>UIプレビューは共通コードからでも利用できます。
        <p><a href="compose-hot-reload.md">Compose Hot Reload</a>を使用すると、アプリを再起動したり状態を失ったりすることなく、UIの変更を即座に確認できます。</p></td>
        <td>VS CodeおよびAndroid Studio用のIDEプラグインが利用可能です。</td>
    </tr>
    <tr>
        <td><b>テクノロジーを使用している企業</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、<a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>、<a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>、<a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>など、その他は弊社の<a href="case-studies.topic">KMPケーススタディ</a>に掲載されています。</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">Xiaomi</a>、<a href="https://flutter.dev/showcase/wolt">Wolt</a>、<a href="https://flutter.dev/showcase/universal-studios">Universal Studios</a>、<a href="https://flutter.dev/showcase/alibaba-group">Alibaba Group</a>、<a href="https://flutter.dev/showcase/bytedance">ByteDance</a>、<a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>、<a href="https://flutter.dev/showcase/ebay">eBay Motors</a>、<a href="https://flutter.dev/showcase/google-pay">Google Pay</a>、<a href="https://flutter.dev/showcase/so-vegan">So Vegan</a>など、その他は<a href="https://flutter.dev/showcase">Flutter Showcase</a>に掲載されています。</td>
    </tr>
</table>

[![クロスプラットフォーム開発のためにKotlin Multiplatformを活用しているグローバル企業の実際のユースケースを探る。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

また、Googleのブログ記事「[Making Development Across Platforms Easier for Developers](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)」も参照してください。このブログ記事では、プロジェクトに適した技術スタックを選択するためのガイダンスを提供しています。

Kotlin MultiplatformとFlutterの追加比較を探している場合は、Philipp Lackner氏による[KMP vs. Flutterのビデオ](https://www.youtube.com/watch?v=dzog64ENKG0)も視聴できます。このビデオでは、コード共有、UIレンダリング、パフォーマンス、そして両技術の将来に関して、興味深い考察が共有されています。

特定のビジネスニーズ、目標、タスクを慎重に評価することで、要件を最もよく満たすクロスプラットフォームソリューションを特定できます。