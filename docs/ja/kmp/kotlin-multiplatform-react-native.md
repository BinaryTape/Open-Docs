<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="kotlin-multiplatform-react-native"
       title="Kotlin Multiplatform vs. React Native: クロスプラットフォーム比較">
<web-summary>Kotlin Multiplatform with Compose MultiplatformがReact Nativeとコード共有、エコシステム、UIレンダリングの点でどのように比較されるかを探り、どちらのツールスタックがあなたのチームに最適かを確認してください。</web-summary>
<tip>
    <p>この比較記事は、Kotlin MultiplatformがAndroidとiOS全体で真のネイティブエクスペリエンスを提供し、プラットフォームAPIへのフルアクセスを可能にすることで優れていることを強調しています。KMPは、特に共有UIコードにCompose Multiplatformを使用する場合に、パフォーマンス、保守性、ネイティブなルックアンドフィールに重点を置くチームにとって特に魅力的です。一方、React Nativeは、特に迅速なプロトタイピングにおいて、JavaScriptの専門知識を持つチームに適しているかもしれません。</p>
</tip>
<p>クロスプラットフォーム開発は、チームがアプリケーションを構築する方法を大きく変え、共有コードベースから複数のプラットフォーム向けにアプリを提供できるようになりました。このアプローチにより、開発が合理化され、デバイス間でより一貫したユーザーエクスペリエンスを確保するのに役立ちます。</p>
<p>以前は、AndroidとiOS向けに構築する場合、多くの場合異なるチームによって2つの別々のコードベースを維持する必要があり、作業の重複とプラットフォーム間の顕著な違いが生じていました。クロスプラットフォームソリューションは、市場投入までの時間を短縮し、全体的な効率を向上させました。</p>
<p>利用可能なツールの中で、Kotlin Multiplatform、React Native、Flutterは、最も広く採用されている3つのオプションとして際立っています。この記事では、あなたの製品とチームに最適なものを選ぶのに役立つように、両方を詳しく見ていきます。</p>
<chapter title="Kotlin MultiplatformとCompose Multiplatform" id="kotlin-multiplatform-and-compose-multiplatform">
    <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a>は、JetBrainsが開発したオープンソース技術で、Android、iOS、デスクトップ (Windows、macOS、Linux)、Web、バックエンド間でコード共有を可能にします。開発者は、ネイティブ機能とパフォーマンスを維持しながら、複数の環境でKotlinを再利用できます。</p>
    <p>採用は着実に増加しています。過去2回の<a href="https://www.jetbrains.com/lp/devecosystem-2024/">Developer Ecosystem調査</a>の回答者の間で、Kotlin Multiplatformの使用率はわずか1年で2倍以上に増加しました。2024年の7%から2025年には18%に増加しており、その勢いの高まりを明確に示しています。</p>
    <img src="kmp-growth-deveco.svg"
         alt="Developer Ecosystem調査の過去2回の回答者の間で、KMPの使用率は2024年の7%から2025年には18%に増加しました。"
         width="700"/>
    <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                      alt="Kotlin Multiplatformを発見する"
                                                                      style="block"
                                                                      width="500"/></a></p>
    <p>KMPでは、共有戦略を選択できます。アプリのエントリーポイントを除くすべてのコードを共有することから、単一のロジック（ネットワークやデータベースモジュールなど）を共有すること、またはUIをネイティブに保ちながらビジネスロジックを共有することまで、柔軟に対応できます。</p>
    <p>プラットフォーム間でUIコードを共有するには、<a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">Compose Multiplatform</a>を使用できます。これは、Kotlin MultiplatformとGoogleのJetpack Composeを基盤としたJetBrainsの最新の宣言型フレームワークです。<a href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/?_gl=1*dcswc7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTA2NzU0MzQkbzM2JGcxJHQxNzUwNjc1NjEwJGo2MCRsMCRoMA..">iOS、Android、デスクトップで安定版</a>であり、Webサポートは現在ベータ版です。</p>
    <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                       alt="Compose Multiplatformを探索する"
                                                                       style="block"
                                                                       width="500"/></a></p>
    <p>Kotlin Multiplatformは、Kotlin 1.2 (2017年) で最初に導入され、2023年11月に<a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">安定版</a>に達しました。Google I/O 2024で、GoogleはAndroidとiOS間でビジネスロジックを共有するために、<a
            href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">AndroidでのKotlin Multiplatformの使用に関する公式サポート</a>を発表しました。
    </p>
</chapter>
<chapter title="React Native" id="react-native">
    <p>React Nativeは、<a href="https://reactjs.org/">React</a>（Webおよびネイティブユーザーインターフェース用のライブラリ）とアプリプラットフォームのネイティブ機能を使用してAndroidおよびiOSアプリケーションを構築するためのオープンソースフレームワークです。React Nativeにより、開発者はJavaScriptを使用してプラットフォームのAPIにアクセスし、再利用可能でネスト可能なコードのバンドルであるReactコンポーネントを使用してUIの外観と動作を記述できます。</p>
    <p>React Nativeは2015年1月にReact.js Confで初めて発表されました。その年の後半にMetaはF8 2015でReact Nativeをリリースし、それ以来維持し続けています。</p>
    <p>MetaがReact Native製品を監督していますが、<a
            href="https://github.com/facebook/react-native/blob/HEAD/ECOSYSTEM.md">React Nativeエコシステム</a>は、パートナー、コアコントリビューター、および活発なコミュニティで構成されています。今日、このフレームワークは世界中の個人や企業からの貢献によって支えられています。</p>
</chapter>
<chapter title="Kotlin MultiplatformとReact Nativeの比較"
         id="kotlin-multiplatform-vs-react-native-side-by-side-comparison">
    <table style="both">
        <tr>
            <td></td>
            <td><b>Kotlin Multiplatform</b></td>
            <td><b>React Native</b></td>
        </tr>
        <tr>
            <td><b>開発元</b></td>
            <td>JetBrains</td>
            <td>Meta</td>
        </tr>
        <tr>
            <td><b>言語</b></td>
            <td>Kotlin</td>
            <td>JavaScript, TypeScript</td>
        </tr>
        <tr>
            <td><b>柔軟性とコード再利用</b></td>
            <td>ビジネスロジックやUIを含む、コードベースの任意の部分を1%から100%まで共有できます。段階的に採用したり、最初から使用してプラットフォーム間でネイティブな感触のアプリを構築したりできます。
            </td>
            <td>個々の機能から完全なアプリまで、ビジネスロジックとUIコンポーネントをプラットフォーム間で再利用できます。既存のネイティブアプリケーションにReact Nativeを追加して、新しい画面やユーザーフローを構築できます。
            </td>
        </tr>
        <tr>
            <td><b>パッケージ、依存関係、エコシステム</b></td>
            <td>パッケージは<a href="https://central.sonatype.com/">Maven Central</a>およびその他のリポジトリから入手できます。
                <p>これには、KMPライブラリの検索を簡素化するために設計された<a href="http://klibs.io">klibs.io</a>（アルファ版）が含まれます。</p>
                <p>この<a href="https://github.com/terrakok/kmp-awesome">リスト</a>には、最も人気のあるKMPライブラリとツールの一部が含まれています。</p></td>
            <td><a href="https://reactnative.dev/docs/libraries">React Nativeライブラリ</a>は通常、<a
                    href="https://docs.npmjs.com/cli/npm">npm CLI</a>や<a href="https://classic.yarnpkg.com/en/">Yarn
                    Classic</a>などのNode.jsパッケージマネージャーを使用して、<a href="https://www.npmjs.com/">npmレジストリ</a>からインストールされます。
            </td>
        </tr>
        <tr>
            <td><b>ビルドツール</b></td>
            <td>Gradle（Appleデバイスをターゲットとするアプリケーションの場合はXcode）。</td>
            <td>React Nativeコマンドラインツールと<a href="https://metrobundler.dev/">Metro bundler</a>。これらは内部でAndroid向けにGradleを、iOS向けにXcodeビルドシステムを呼び出します。
            </td>
        </tr>
        <tr>
            <td><b>ターゲット環境</b></td>
            <td>Android、iOS、Web、デスクトップ、サーバーサイド。</td>
            <td>Android、iOS、Web、デスクトップ。
                <p>Webおよびデスクトップのサポートは、<a href="https://github.com/necolas/react-native-web">React Native Web</a>、<a
                        href="https://github.com/microsoft/react-native-windows">React Native Windows</a>、<a
                        href="https://github.com/microsoft/react-native-macos">React Native macOS</a>などのコミュニティおよびパートナー主導のプロジェクトを通じて提供されます。</p></td>
        </tr>
        <tr>
            <td><b>コンパイル</b></td>
            <td>デスクトップおよびAndroid向けにはJVMバイトコードに、WebではJavaScriptまたはWasmに、ネイティブプラットフォーム向けにはプラットフォーム固有のバイナリにコンパイルされます。
            </td>
            <td>React Nativeは、Metroを使用してJavaScriptコードとアセットをビルドします。
                <p>React Nativeには、ビルド中にJavaScriptをHermesバイトコードにコンパイルする<a
                        href="https://reactnative.dev/docs/hermes">Hermes</a>のバンドルバージョンが付属しています。React Nativeは、<a
                        href="https://reactnative.dev/docs/javascript-environment">JavaScriptエンジン</a>としてJavaScriptCoreを使用することもサポートしています。</p>
                <p>ネイティブコードはAndroidではGradleによって、iOSではXcodeによってコンパイルされます。</p></td>
        </tr>
        <tr>
            <td><b>ネイティブAPIとの通信</b></td>
            <td>KotlinはSwift/Objective-CとJavaScriptの両方との相互運用性があるため、ネイティブAPIはKotlinコードから直接アクセスできます。
            </td>
            <td>React Nativeは、ネイティブコードをJavaScriptアプリケーションコードに接続するための一連のAPI（Native ModulesとNative Components）を公開しています。新しいアーキテクチャでは、<a
                    href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md">Turbo Native Module</a>と<a
                    href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md">Fabric Native Components</a>を使用して同様の結果を達成します。
            </td>
        </tr>
        <tr>
            <td><b>UIレンダリング</b></td>
            <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a>は、GoogleのJetpack Composeに基づいて、プラットフォーム間でUIを共有するために使用でき、OpenGL、ANGLE（OpenGL ES 2または3の呼び出しをネイティブAPIに変換）、Vulkan、Metalと互換性のあるSkiaエンジンを使用します。
            </td>
            <td>React Nativeには、プラットフォームに依存しないコアなネイティブコンポーネント（<code>View</code>、<code>Text</code>、<code>Image</code>など）のセットが含まれており、これらはiOSの<code>UIView</code>やAndroidの<code>android.view</code>などのプラットフォームのネイティブUIビルディングブロックに直接マッピングされます。
            </td>
        </tr>
        <tr>
            <td><b>UI開発のイテレーション</b></td>
            <td>共通コードからでもUIプレビューが利用できます。
                <p><a href="compose-hot-reload.md">Compose Hot Reload</a>を使用すると、アプリを再起動したり状態を失ったりすることなく、UIの変更を即座に確認できます。</p></td>
            <td><a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a>は、Reactコンポーネントの変更に対してほぼ瞬時のフィードバックを得られるReact Nativeの機能です。
            </td>
        </tr>
        <tr>
            <td><b>テクノロジーを使用している企業</b></td>
            <td>
                <a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、
                <a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a
                    href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald's</a>、
                <a href="https://youtu.be/5lkZj4v4-ks?si=DoW00DU7CYkaMmKc">Google Workspace</a>、<a
                    href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a
                    href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、
                <a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a
                    href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a
                    href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>など、
                詳細は<a href="case-studies.topic">KMPのケーススタディ</a>に記載されています。</td>
            <td>Facebook、<a href="https://engineering.fb.com/2024/10/02/android/react-at-meta-connect-2024/">Instagram</a>、
                <a href="https://devblogs.microsoft.com/react-native/">Microsoft Office</a>、<a
                        href="https://devblogs.microsoft.com/react-native/">Microsoft Outlook</a>、Amazon Shopping、
                <a href="https://medium.com/mercari-engineering/why-we-decided-to-rewrite-our-ios-android-apps-from-scratch-in-react-native-9f1737558299">Mercari</a>、
                Tableau、<a href="https://github.com/wordpress-mobile/gutenberg-mobile">WordPress</a>、<a
                        href="https://nearform.com/work/puma-scaling-across-the-globe/">Puma</a>、PlayStation
                アプリなど、詳細は<a href="https://reactnative.dev/showcase">React Native Showcase</a>に記載されています。
            </td>
        </tr>
    </table>
    <p>また、<a href="kotlin-multiplatform-flutter.md">Kotlin MultiplatformとFlutter</a>の比較もご覧いただけます。</p>
</chapter>
<chapter title="プロジェクトに適したクロスプラットフォーム技術の選択"
         id="choosing-the-right-cross-platform-technology-for-your-project">
    <p>クロスプラットフォームフレームワークの決定は、万能なソリューションを見つけることではありません。それは、プロジェクトの目標、技術要件、チームの専門知識に最適なものを選択することです。複雑なUIを持つ豊富な機能の製品を構築している場合でも、既存のスキルで迅速に立ち上げを目指している場合でも、適切な選択はあなたの特定の優先順位によって異なります。UIのカスタマイズにどの程度の制御が必要か、長期的な安定性がどれほど重要か、そしてどのプラットフォームをサポートする予定かを考慮してください。</p>
    <p>JavaScriptの経験が豊富なチームは、特に迅速なプロトタイピングにおいて、React Nativeが実用的な選択肢であると考えるかもしれません。一方、Kotlin Multiplatformは異なるレベルの統合を提供します。完全にネイティブなAndroidアプリを生成し、iOSではネイティブバイナリにコンパイルされ、ネイティブAPIにシームレスにアクセスできます。UIは完全にネイティブにすることも、高性能グラフィックエンジンを使用して美しくレンダリングされるCompose Multiplatformを介して共有することもできます。これにより、KMPは、コード共有の恩恵を受けながらも、ネイティブなルックアンドフィール、保守性、パフォーマンスを優先するチームにとって特に魅力的です。</p>
    <p>次のプロジェクトに適した<a
            href="cross-platform-frameworks.md">クロスプラットフォーム開発フレームワーク</a>の選択方法に関する詳細な記事で、さらにガイダンスを見つけることができます。</p>
</chapter>
<chapter title="よくある質問" id="frequently-asked-questions">
    <p>
        <control>Q: Kotlin Multiplatformはプロダクションレディですか？</control>
    </p>
    <p>A: Kotlin Multiplatformは、<a
            href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">プロダクションで使用できる安定したテクノロジー</a>です。これは、Android、iOS、デスクトップ (JVM)、サーバーサイド (JVM)、Web全体で、最も保守的な使用シナリオにおいても、プロダクションでコードを共有するためにKotlin Multiplatformを使用できることを意味します。</p>
    <p>Compose Multiplatform（プラットフォーム間で共有UIを構築するためのフレームワーク。Kotlin MultiplatformとGoogleのJetpack Composeを搭載）は、iOS、Android、デスクトップで安定しています。Webサポートは現在ベータ版です。</p>
    <p>
        <control>Q: Kotlin MultiplatformはReact Nativeよりも優れていますか？</control>
    </p>
    <p>A: Kotlin MultiplatformとReact Nativeはどちらも独自の強みがあり、選択はプロジェクトの具体的な目標、技術要件、チームの専門知識に依存します。上記の比較では、コード共有、ビルドツール、コンパイル、エコシステムなどの分野における主な違いを概説し、どちらのオプションがユースケースに最適かを判断するのに役立てました。</p>
    <p>
        <control>Q: GoogleはKotlin Multiplatformをサポートしていますか？</control>
    </p>
    <p>A: Google I/O 2024で、GoogleはAndroidとiOS間でビジネスロジックを共有するために、<a
            href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">AndroidでのKotlin Multiplatformの使用に関する公式サポート</a>を発表しました。</p>
    <p>
        <control>Q: Kotlin Multiplatformを学ぶ価値はありますか？</control>
    </p>
    <p>A: ネイティブパフォーマンスと柔軟性を維持しながら、Android、iOS、デスクトップ、Web間でコードを共有することに興味があるなら、Kotlin Multiplatformは学ぶ価値があります。これはJetBrainsによってサポートされており、AndroidとiOS間でビジネスロジックを共有するために、Android上でGoogleによって公式にサポートされています。さらに、Compose Multiplatformを使用するKMPは、マルチプラットフォームアプリを構築する企業によってプロダクションでますます採用されています。</p>
</chapter>
</topic>