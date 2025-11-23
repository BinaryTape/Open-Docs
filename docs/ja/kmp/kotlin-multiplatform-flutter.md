# Kotlin MultiplatformとFlutter: クロスプラットフォーム開発ソリューション

<web-summary>この記事ではKotlin MultiplatformとFlutterを探求し、それらの機能と、クロスプラットフォームプロジェクトに最適な選択を行う方法を理解するのに役立ちます。</web-summary> 

急速に進化するテクノロジーの世界において、開発者は高品質なアプリケーションを構築するための効率的なフレームワークやツールを常に探しています。しかし、利用可能な選択肢の中から選ぶ際、いわゆる「最良の選択肢」を見つけることに重点を置きすぎないことが重要です。このアプローチは、必ずしも最も適切な選択肢につながるとは限りません。

各プロジェクトは独自のものであり、特定の要件を持っています。この記事は、あなたの選択をナビゲートし、Kotlin MultiplatformやFlutterのようなテクノロジーがあなたのプロジェクトに最も適しているかをより深く理解するのに役立つことを目的としています。これにより、情報に基づいた意思決定を行えるようになります。

## クロスプラットフォーム開発: 最新のアプリケーション構築への統合アプローチ

クロスプラットフォーム開発は、単一のコードベースで複数のプラットフォームで動作するアプリケーションを構築する方法を提供し、各システムで同じ機能を再記述する必要をなくします。しばしば[モバイル開発](cross-platform-mobile-development.md)（AndroidとiOSの両方をターゲットとする）と関連付けられますが、このアプローチはモバイルをはるかに超えて、ウェブ、デスクトップ、さらにはサーバーサイド環境もカバーします。

中心となる考え方は、コードの再利用を最大化しつつ、必要に応じてプラットフォーム固有の機能を実装できるようにすることです。これにより、開発プロセスが効率化され、メンテナンス作業が削減されます。チームは開発サイクルを加速し、コストを削減し、プラットフォーム間の一貫性を確保できるため、クロスプラットフォーム開発は今日のますます多様化するアプリケーション環境において賢明な選択となります。

## Kotlin MultiplatformとFlutter: プラットフォームをまたいだ開発の効率化

FlutterとKotlin Multiplatformは、異なるプラットフォーム間でのアプリケーション開発を簡素化する人気のクロスプラットフォームテクノロジーです。

### Flutter

[Flutter](https://flutter.dev/)は、単一のコードベースからネイティブコンパイルされたマルチプラットフォームアプリケーションを構築するためのオープンソースフレームワークです。Android、iOS、ウェブ、デスクトップ（Windows、macOS、Linux）、および組み込みシステム間で、すべて単一の共有アプリケーションコードベースから、リッチなアプリ体験を作成できます。FlutterアプリはDartプログラミング言語を使用して記述されます。FlutterはGoogleによってサポートされ、使用されています。

Skyという名前で2014年に初めて導入され、[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/)は2018年12月にFlutter Liveで正式に発表されました。

Flutterの開発者コミュニティは大規模かつ非常に活発で、継続的な改善とサポートを提供しています。Flutterでは、FlutterおよびDartエコシステム内の開発者によって貢献された共有パッケージを使用できます。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP)は、JetBrainsによって構築されたオープンソーステクノロジーで、開発者はAndroid、iOS、ウェブ、デスクトップ（Windows、macOS、Linux）、およびサーバーサイド向けのアプリケーションを作成でき、ネイティブプログラミングの利点を保持しつつ、これらのプラットフォーム間でKotlinコードを効率的に再利用できます。

Kotlin Multiplatformでは、さまざまな選択肢があります。アプリのエントリポイントを除くすべてのコードを共有したり、ネットワークやデータベースモジュールのような単一のロジックの一部を共有したり、ビジネスロジックを共有しつつUIをネイティブのままにしたりできます。

![Kotlin Multiplatform is a technology for reusing up to 100% of your code](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatformは2017年にKotlin 1.2の一部として初めて導入されました。2023年11月、Kotlin Multiplatformは安定版になりました。Google I/O 2024では、GoogleがAndroidおよびiOS間でビジネスロジックを共有するための[Kotlin Multiplatformのサポート](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)を発表しました。

Kotlin Multiplatformの全体的な方向性についてさらに詳しく知りたい場合は、私たちのブログ記事「[What’s Next for Kotlin Multiplatform and Compose Multiplatform](https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/)」をご覧ください。

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

JetBrains製の最新の宣言型フレームワークである[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)を使用すると、Kotlin MultiplatformとGoogleのJetpack Composeに基づいて構築された、複数のプラットフォーム間で共有UIコードを記述できます。

Compose Multiplatformは現在、[iOS](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)、Android、デスクトップで安定しており、ウェブではベータ版です。

[![Explore Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

私たちの専用記事では、[Compose MultiplatformとJetpack Compose](compose-multiplatform-and-jetpack-compose.md)の関係を、主な違いを強調しながら概説しています。

### Kotlin MultiplatformとFlutter: 概要

<table style="both">
    
<tr>
<td></td>
        <td><b>Kotlin Multiplatform</b></td>
        <td><b>Flutter</b></td>
</tr>

    
<tr>
<td><b>開発元</b></td>
        <td>JetBrains</td>
        <td>Google</td>
</tr>

    
<tr>
<td><b>言語</b></td>
        <td>Kotlin</td>
        <td>Dart</td>
</tr>

    
<tr>
<td><b>柔軟性とコードの再利用</b></td>
        <td>ビジネスロジックやUIを含む、コードベースの任意の割合（1%から100%）を共有できます。</td>
        <td>すべてのプラットフォームで100%のコード共有により、アプリケーションのすべてのピクセルを制御し、カスタマイズされた適応性の高いデザインを作成できます。</td>
</tr>

    
<tr>
<td><b>パッケージ、依存関係、エコシステム</b></td>
        <td>パッケージは<a href="https://central.sonatype.com/">Maven Central</a>およびその他のリポジトリから入手できます。
            <p><a href="http://klibs.io">klibs.io</a>（アルファ版）は、KMPライブラリの検索を簡素化するために設計されています。</p>
            <p>この<a href="https://github.com/terrakok/kmp-awesome">リスト</a>には、最も人気のあるKMPライブラリとツールの一部が含まれています。</p> </td>
        <td>パッケージは<a href="https://pub.dev/">Pub.dev</a>から入手できます。</td>
</tr>

    
<tr>
<td><b>ビルドツール</b></td>
        <td>Gradle（AppleデバイスをターゲットとするアプリケーションではXcodeも使用）。</td>
        <td>Flutterコマンドラインツール（内部でGradleとXcodeを使用）。</td>
</tr>

    
<tr>
<td><b>コード共有</b></td>
        <td>Android、iOS、ウェブ、デスクトップ、サーバーサイド。</td>
        <td>Android、iOS、ウェブ、デスクトップ、組み込みデバイス。</td>
</tr>

    
<tr>
<td><b>コンパイル</b></td>
        <td>デスクトップとAndroid向けにはJVMバイトコードに、ウェブ向けにはJavaScriptまたはWasmに、ネイティブプラットフォーム向けにはプラットフォーム固有のバイナリにコンパイルされます。</td>
        <td>デバッグビルドではDartコードが仮想マシンで実行されます。
        <p>リリースビルドでは、ネイティブプラットフォーム向けにプラットフォーム固有のバイナリを、ウェブ向けにJavaScript/Wasmを出力します。</p>
        </td>
</tr>

    
<tr>
<td><b>ネイティブAPIとの通信</b></td>
        <td>ネイティブAPIは、<Links href="/kmp/multiplatform-expect-actual" summary="undefined">expect/actual宣言</Links>を使用してKotlinコードから直接アクセスできます。</td>
        <td>ホストプラットフォームとの通信は、<a href="https://docs.flutter.dev/platform-integration/platform-channels">プラットフォームチャネル</a>を使用して可能です。</td>
</tr>

    
<tr>
<td><b>UIレンダリング</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a>を使用すると、GoogleのJetpack Composeをベースとして、プラットフォーム間でUIを共有できます。これは、OpenGL、ANGLE（OpenGL ES 2または3の呼び出しをネイティブAPIに変換）、Vulkan、およびMetalと互換性のあるSkiaエンジンを使用します。</td>
        <td>Flutterウィジェットは、カスタムの<a href="https://docs.flutter.dev/perf/impeller">Impellerエンジン</a>を使用して画面にレンダリングされます。これはプラットフォームとデバイスに応じて、Metal、Vulkan、またはOpenGLを使用してGPUと直接通信します。</td>
</tr>

    
<tr>
<td><b>UI開発のイテレーション</b></td>
        <td>UIプレビューは共通コードからでも利用できます。
        <p><Links href="/kmp/compose-hot-reload" summary="undefined">Compose Hot Reload</Links>を使用すると、アプリを再起動したり状態を失ったりすることなく、UIの変更を即座に確認できます。</p></td>
        <td>VS CodeおよびAndroid Studio用のIDEプラグインが利用できます。</td>
</tr>

    
<tr>
<td><b>採用企業</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、<a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>、<a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>、<a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>など、さらに多くの企業が私たちの<a href="https://kotlinlang.org/case-studies/?type=multiplatform">KMP事例集</a>に記載されています。</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">Xiaomi</a>、<a href="https://flutter.dev/showcase/wolt">Wolt</a>、<a href="https://flutter.dev/showcase/universal-studios">Universal Studios</a>、<a href="https://flutter.dev/showcase/alibaba-group">Alibaba Group</a>、<a href="https://flutter.dev/showcase/bytedance">ByteDance</a>、<a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>、<a href="https://flutter.dev/showcase/ebay">eBay Motors</a>、<a href="https://flutter.dev/showcase/google-pay">Google Pay</a>、<a href="https://flutter.dev/showcase/so-vegan">So Vegan</a>など、さらに多くの企業が<a href="https://flutter.dev/showcase">Flutter Showcase</a>に記載されています。</td>
</tr>

</table>

[![Kotlin Multiplatformをクロスプラットフォーム開発に活用しているグローバル企業の実際のユースケースを探る。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

また、Googleのブログ記事「[Making Development Across Platforms Easier for Developers](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)」も参照できます。これは、プロジェクトに適切な技術スタックを選択するためのガイダンスを提供しています。

Kotlin MultiplatformとFlutterのさらなる比較については、Philipp Lacknerによる「[KMP vs. Flutter video](https://www.youtube.com/watch?v=dzog64ENKG0)」もご覧ください。この動画では、コード共有、UIレンダリング、パフォーマンス、および両テクノロジーの将来性に関して、興味深い考察が共有されています。

あなたの特定のビジネスニーズ、目的、タスクを慎重に評価することで、要件に最も合致するクロスプラットフォームソリューションを特定できます。