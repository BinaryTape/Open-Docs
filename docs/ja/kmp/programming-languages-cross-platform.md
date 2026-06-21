<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="programming-languages-cross-platform"
       title="クロスプラットフォームアプリケーション開発で人気のプログラミング言語">
    <title>
        クロスプラットフォームアプリケーション開発で人気のプログラミング言語
    </title>
    <web-summary>クロスプラットフォーム開発のための言語選択における主な考慮事項、人気テクノロジーの比較、および実際のケーススタディを紹介します。
    </web-summary>
    <p>最近、<a href="cross-platform-mobile-development.topic">クロスプラットフォーム開発</a>という言葉を耳にする機会がますます増えていることにお気づきでしょう。実際、クロスプラットフォームプログラミングは、ソフトウェア開発の文脈において急速に普及しています。特にモバイルアプリの分野で顕著ですが、その用途は決してモバイルアプリだけに限定されません。企業が複数のデバイスやオペレーティングシステム（OS）にわたってより幅広いオーディエンスにリーチしようとする中、開発者はプラットフォームの壁を取り払う汎用性の高い言語やフレームワークへと目を向けています。</p>
    <p>クロスプラットフォーム開発を始めるにあたって、どのプログラミング言語が最適か迷っているのであれば、この概要記事が正しい方向へと導き、洞察や実際のユースケースの例を提供します。</p>
    <chapter title="クロスプラットフォーム開発を理解する" id="understanding-cross-platform-development">
        <p>クロスプラットフォームアプリケーション開発とは、iOS、Android、Windows、macOS、ウェブブラウザなど、複数のプラットフォームで動作するソフトウェアを単一のコードベース（codebase）で作成する開発手法を指します。この手法は、モバイルアプリへの需要の高まりを背景に、近年大きな人気を博しています。モバイルエンジニアは、プラットフォームごとに個別のアプリケーションを開発する代わりに、iOSとAndroidの間でソースコードの一部またはすべてを共有できます。</p>
        <p><a href="native-and-cross-platform.topic">ネイティブ開発とクロスプラットフォーム開発のメリットと制限</a>、およびこれら2つのアプローチをどのように選択するかについては、専用のガイドを用意しています。クロスプラットフォーム開発の主な利点には以下のものがあります。</p>
        <list type="decimal">
            <li>
                <p>
                    <control>コスト効率:</control>
                    プラットフォームごとに個別のアプリを構築することは、時間とリソースの両面でコストがかさむ可能性があります。クロスプラットフォーム開発では、一度コードを書いて複数のプラットフォームにデプロイできるため、開発コストを削減できます。
                </p>
            </li>
            <li>
                <p>
                    <control>開発の高速化:</control>
                    この手法は、開発者が単一のコードベースのみを記述・維持すればよいため、開発プロセスを加速させるのに役立ちます。
                </p>
            </li>
            <li>
                <p>
                    <control>効率的で柔軟なコード共有:</control>
                    現代のクロスプラットフォームテクノロジーにより、開発者はネイティブプログラミングの利点を維持しながら、複数のプラットフォームでコードを再利用できます。
                </p>
            </li>
            <li>
                <p>
                    <control>プラットフォーム間での一貫したユーザー体験:</control>
                    クロスプラットフォーム開発により、計算やワークフローなどの主要な動作が、必要に応じて異なるプラットフォームで同じ結果を提供することが保証されます。これにより一貫性が保たれ、ユーザーがデバイスやOSに関係なく同じ体験を得ることができます。
                </p>
            </li>
        </list>
        <p>この記事では、クロスプラットフォーム開発で最も人気のあるプログラミング言語のいくつかについて説明します。</p>
    </chapter>
    <chapter title="人気のクロスプラットフォームプログラミング言語、フレームワーク、テクノロジー"
             id="popular-cross-platform-programming-languages-frameworks-and-technologies">
        <p>この記事では、クロスプラットフォーム開発に適した、十分に確立されたプログラミング言語に焦点を当てます。さまざまな目的のために設計された多くの言語がありますが、このセクションでは、関連する統計やそれらをサポートするフレームワークとともに、クロスプラットフォーム開発で最も人気のあるプログラミング言語の簡潔な概要を提供します。</p>
        <p>
            <control>概要と人気度</control>
        </p>
        <table style="header-row">
            <tr>
                <td>言語</td>
                <td>初登場</td>
                <td>人気度 (<a href="https://survey.stackoverflow.co/2025/technology/">Stack
                    Overflow, 2025</a>)</td>
                <td>人気度 (<a href="https://devecosystem-2025.jetbrains.com/">DevEco
                    Report 2025</a>)</td>
            </tr>
            <tr>
                <td>JavaScript</td>
                <td>1995年</td>
                <td>1位 (66%)</td>
                <td>1位 (61%)</td>
            </tr>
            <tr>
                <td>Dart</td>
                <td>2011年</td>
                <td>19位 (5.9%)</td>
                <td>16位 (8%)</td>
            </tr>
            <tr>
                <td>Kotlin</td>
                <td>2011年</td>
                <td>15位 (10.08%)</td>
                <td>12位 (18%)</td>
            </tr>
            <tr>
                <td>C#</td>
                <td>2000年</td>
                <td>8位 (27.8%)</td>
                <td>9位 (21%)</td>
            </tr>
            <tr>
                <td>C++</td>
                <td>1985年</td>
                <td>9位 (23.5%)</td>
                <td>8位 (25%)</td>
            </tr>
        </table>
        <p>
            <control>エコシステムとテクノロジー</control>
        </p>
        <table style="header-row">
            <tr>
                <td>言語</td>
                <td>エコシステム/ツール</td>
                <td>テクノロジー/フレームワーク</td>
            </tr>
            <tr>
                <td>JavaScript</td>
                <td>豊富なエコシステム、多くのライブラリ、活発なコミュニティ</td>
                <td>React Native, Ionic</td>
            </tr>
            <tr>
                <td>Dart</td>
                <td>成長中のエコシステム、Googleがサポート</td>
                <td>Flutter</td>
            </tr>
            <tr>
                <td>Kotlin</td>
                <td>拡大するエコシステム、JetBrainsによる強力なサポート</td>
                <td>Kotlin Multiplatform</td>
            </tr>
            <tr>
                <td>C#</td>
                <td>Microsoftからの強力なサポート、大規模なエコシステム</td>
                <td>.NET MAUI</td>
            </tr>
            <tr>
                <td>C++</td>
                <td>成熟したエコシステム、サードパーティライブラリは比較的少なめ</td>
                <td>Qt</td>
            </tr>
        </table>
        <p>
            <control>JavaScript</control>
        </p>
        <p>JavaScriptは、ウェブページに複雑な機能を実装することを可能にする、広く使用されているプログラミング言語です。React NativeやIonicのようなフレームワークの導入により、クロスプラットフォームアプリ開発における人気の選択肢となりました。JetBrainsが実施した最新の<a href="https://devecosystem-2025.jetbrains.com/">開発者エコシステムアンケート（Developer Ecosystem Survey）</a>によると、開発者の61%がJavaScriptを使用しており、最も人気のあるプログラミング言語となっています。</p>
        <p>
            <control>Dart</control>
        </p>
        <p>Dartは、2011年にGoogleによって導入されたオブジェクト指向のクラスベースのプログラミング言語です。Dartは、単一のコードベースからマルチプラットフォームアプリケーションを構築するためのGoogle製のオープンソースフレームワークであるFlutterの基盤となっています。Dartは、Flutterアプリを動かす言語とランタイムを提供します。</p>
        <p>
            <control>Kotlin</control>
        </p>
        <p>Kotlinは、JetBrainsによって開発されたモダンで成熟したマルチプラットフォームプログラミング言語です。<a
                href="https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages">Octoverseレポート</a>によると、2024年に5番目に急成長している言語でした。簡潔で安全、Javaや他の言語との相互運用性があり、Googleが推奨するAndroidアプリ開発の優先言語でもあります。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a>は、ネイティブプログラミングの利点を維持しながら、さまざまなプラットフォーム向けのアプリケーションを作成し、それらの間でKotlinコードを再利用できるようにするJetBrainsのテクノロジーです。さらに、JetBrainsは、KMPとJetpack Composeに基づいた、複数のプラットフォーム間でUIを共有するための宣言型フレームワークであるCompose Multiplatformを提供しています。2024年5月、GoogleはAndroidとiOSの間でビジネスロジックを共有するための<a
                    href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">Kotlin Multiplatformの公式サポート</a>を発表しました。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                          alt="Kotlin Multiplatformを見つける"
                                                                          width="500" style="block"/></a></p>
        <p>
            <control>C#</control>
        </p>
        <p>C#は、Microsoftによって開発されたクロスプラットフォームの汎用プログラミング言語です C#は.NET Frameworkにおいて最も人気のある言語です。.NET MAUIは、Android、iOS、Mac、Windows向けに、単一のC#コードベースからネイティブのクロスプラットフォームなデスクトップおよびモバイルアプリを構築するためのフレームワークです。</p>
        <p>
            <control>C++</control>
        </p>
        <p>C++は、1985年にC言語の拡張として最初にリリースされた汎用プログラミング言語です。Qtは、モジュール化されたC++ライブラリクラスのセットを含み、アプリケーション開発のためのさまざまなAPIを提供するクロスプラットフォームソフトウェア開発フレームワークです。</p>
    </chapter>
    <chapter title="クロスプラットフォームプログラミング言語を選択する際の主な要因"
             id="key-factors-in-selecting-a-cross-platform-programming-language">
        <p>今日利用可能なあらゆる言語、テクノロジー、ツールがある中で、特にクロスプラットフォーム開発の世界に足を踏い入れたばかりの場合、適切なものを選択するのは圧倒されるかもしれません。さまざまなクロスプラットフォームテクノロジーにはそれぞれ独自の長所と短所がありますが、最終的には構築したいソフトウェアの目標と要件に集約されます。</p>
        <p>プロジェクトの言語やフレームワークを選択する際は、いくつかの重要な要因を念頭に置く必要があります。これらには、アプリケーションの種類、パフォーマンスとUXの要件、関連するツール、および以下で詳しく説明するその他のさまざまな懸念事項が含まれます。</p>
        <p>
            <control>1. アプリケーションの種類</control>
        </p>
        <p>プログラミング言語やフレームワークによって、Windows、macOS、Linux、iOS、Android、ウェブブラウザなどのプラットフォームでのサポート状況が異なります。特定の言語は、特定のプラットフォームやプロジェクトに自然に適しています。</p>
        <p>
            <control>2. パフォーマンスとUXの要件</control>
        </p>
        <p>特定の種類のアプリケーションには、速度、応答性、メモリ使用量、CPUやGPUの消費量など、さまざまな基準で測定される特定のパフォーマンスおよびユーザー体験（UX）の要件があります。将来のアプリケーションが果たす必要のある機能と、上記の基準に対する希望するパラメータを考慮してください。</p>
        <tip>
            <p>例えば、グラフィックスを多用するゲームアプリは、GPUを効率的に活用できる言語の恩恵を受ける可能性があります。一方で、ビジネスアプリはデータベース統合の容易さやネットワーク通信を優先するかもしれません。</p>
        </tip>
        <p>
            <control>3. 既存のスキルセットと学習曲線</control>
        </p>
        <p>次のプロジェクトのテクノロジーを選択する際、開発チームはこれまでの経験を考慮に入れる必要があります。新しい言語やツールの導入にはトレーニングの時間が必要であり、それがプロジェクトを遅らせることもあります。学習曲線が急であればあるほど、チームが習熟するまでに時間がかかります。</p>
        <tip>
            <p>例えば、チームがJavaScriptに非常に精通した開発者で構成されており、新しいテクノロジーを採用するリソースが不足している場合は、React NativeのようにJavaScriptを使用するフレームワークを選択するのが有益かもしれません。</p>
        </tip>
        <p>
            <control>4. 既存のユースケース</control>
        </p>
        <p>考慮すべきもう一つの重要な要因は、そのテクノロジーの現実世界での利用状況です。特定のクロスプラットフォーム言語やフレームワークを正常に導入した企業のケーススタディをレビューすることで、それらのテクノロジーが本番環境でどのように機能するかについての貴重な洞察を得ることができます。これにより、特定のテクノロジーがプロジェクトの目標に適しているかどうかを評価するのに役立ちます。Kotlin Multiplatformを活用してさまざまなプラットフォームで製品レベルのアプリケーションを開発している企業の<a
                    href="https://kotlinlang.org/case-studies/?type=multiplatform">ケーススタディ</a>を探索してみてください。</p>
        <p>例えば、<a href="https://kotlinlang.org/case-studies/#mcdonalds-umain">McDonald'sアプリを手がけるUmainチーム</a>は、iOSとAndroidで共有のKotlinコードベースを使用し、より統一されたモバイル開発アプローチへと移行しました。<a
                    href="https://blog.jetbrains.com/kotlin/2021/01/philips-case-study-building-connectivity-platform-with-kotlin-multiplatform/">PhilipsはKMPを適用</a>してコネクテッドデバイス向けのクロスプラットフォームSDKを動かし、AndroidとiOSで一貫した機能を実現しています。また、<a href="https://kotlinlang.org/case-studies/#9gag">9GAG</a>のようなメディアプラットフォームは、コンテンツとデータロジックのコア部分をアプリ間で共有するためにKMPを使用し、機能の同等性と開発サイクルの高速化を保証しています。</p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg"
                                                                                  alt="実際のKotlin Multiplatformユースケースを探索する"
                                                                                  width="500" style="block"/></a></p>
        <p>
            <control>5. 言語のエコシステム</control>
        </p>
        <p>言語のエコシステムの成熟度も大きな役割を果たします。マルチプラットフォーム開発をサポートするツールやライブラリの可用性と品質に注目してください。例えば、JavaScriptには膨大な数のライブラリがあり、フロントエンドフレームワーク（React、Angular、Vue.js）、バックエンド開発（Express、NestJS）、その他幅広い機能をサポートしています。</p>
        <p>同様に、Flutterにもパッケージやプラグインとして知られる、非常に多く、かつ急速に増加しているライブラリがあります。Kotlin Multiplatformは現時点ではライブラリの数は少ないものの、そのエコシステムは急速に成長しており、世界中の多くのKotlin開発者によって言語が強化されています。<a href="https://klibs.io/">klibs.io</a>では、すでに利用可能な数千のライブラリの中から特定のマルチプラットフォームライブラリを検索できます。
        </p>
        <p>
            <control>6. 人気とコミュニティのサポート</control>
        </p>
        <p>プログラミング言語と関連テクノロジーの人気とコミュニティのサポートを詳しく見る価値もあります。それは単にユーザーやライブラリの数だけではありません。ユーザーやコントリビューターを含む、その言語のコミュニティがいかに活発で協力的であるかに注目してください。利用可能なブログ、ポッドキャスト、フォーラム、その他のリソースを探してみてください。</p>
        <p>
            <control>7. ライセンスとベンダーの持続性</control>
        </p>
        <p>開発者は、大規模なコミュニティや信頼できる組織によってサポートされている、オープンソースでベンダーニュートラルな言語やフレームワークを求めることがよくあります。オープンソースのエコシステム（Kotlin、JavaScript、Dartなど）は、ベンダーロックインの危険を減らし、チームが必要に応じて独自にツールを維持または強化できるようにします。</p>
        <p>同時に、ベンダーによるサポートも重要です。Google、JetBrains、Metaによってサポートされているフレームワークは進化が速く、頻繁なアップグレードが行われます。これらの側面のバランスをとることが重要です。強力なプロジェクトは通常、透明性の高いガバナンス、活発なコミュニティの貢献、そしてメンテナーによる長期的なコミットメントを兼ね備えており、チームが選択したテクノロジーが今後長年にわたって有効であることを保証します。</p>
    </chapter>
    <chapter title="クロスプラットフォーム開発の未来" id="the-future-of-cross-platform-development">
        <p>クロスプラットフォーム開発が進歩するにつれ、いくつかの新たなトレンドがその未来に影響を与え、基本的なコード共有を超えた、よりスマートで柔軟なソリューションへと押し進めています。</p>
        <p>
            <control>WebAssemblyとサーバー駆動型UI</control>
        </p>
        <p>一つの重要なトレンドはWebAssembly（Wasm）の台頭です。これにより、（RustやC++などの言語で書かれた）高性能なコードをブラウザ上でJavaScriptと並行して実行できるようになります。これにより、プラットフォーム固有のコードに大きく依存することなく、プラットフォーム間でネイティブに近いパフォーマンスを提供する、真にポータブルなアプリケーションが可能になります。同時に、サーバー駆動型UI（server-driven UI）が人気を集めており、開発者がバックエンドからアプリのインターフェースをカスタマイズできるようになり、頻繁なクライアントのアップデートの必要性を減らし、デバイス間の一貫性を高めています。</p>
        <p>
            <control>AI支援によるコード生成</control>
        </p>
        <p>もう一つの重要なトレンドは、AI支援によるコード生成です。大規模言語モデルを活用したツールは、ボイラープレートの作成、クロスプラットフォームの抽象化の推奨、さらには言語間のコード変換の支援を通じて、開発をスピードアップさせます。これにより、参入障壁が下がり、特に異なるプラットフォーム間で作業するチームのデリバリーが加速します。</p>
        <p>
            <control>クロスプラットフォームシステムにおけるRustとGoの台頭</control>
        </p>
        <p>RustやGoなどの言語は、クロスプラットフォームのバックエンドサービスやパフォーマンスが重要なコンポーネントで人気が高まっています。特にRustはメモリ安全性とWebAssemblyとの互換性で高く評価されていますが、Goのシンプルさと並行処理モデルは、大規模なクロスプラットフォームアプリケーションに最適です。</p>
        <p>
            <control>ローコードおよびノーコードによる加速</control>
        </p>
        <p>現在、多くの企業がローコード（low-code）およびノーコード（no-code）プラットフォームを使用して、エンジニアの関与を最小限に抑えながら、クロスプラットフォームアプリケーションのプロトタイプを迅速に作成したり、実際に提供したりしています。これらは大規模なプログラムのフルスケール開発を代替することはできませんが、シンプルなユースケースにおいては市場投入までの時間を大幅に短縮します。</p>
        <p>全体として、クロスプラットフォーム開発の未来は、高いパフォーマンス、自動化、汎用性の組み合わせへとシフトしています。これらのテクノロジーが進歩するにつれ、開発者はプラットフォーム固有の複雑さを処理する時間を減らしながら、より豊かで高速、かつ一貫した体験をプラットフォーム間で構築できるようになるでしょう。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="see-kmp-in-action.svg"
                                                                          alt="Kotlin Multiplatformの動作を見る"
                                                                          width="500" style="block"/></a></p>
        </chapter>
        <chapter title="よくある質問（FAQ）" id="frequently-asked-questions">
        <p>
            <control>Q: 最も人気のあるクロスプラットフォームプログラミング言語は何ですか？</control>
        </p>
        <p>A: Kotlin、JavaScript、Python、Java、C#、C++、Dartなどが、最も人気のあるクロスプラットフォーム開発言語に含まれます。その魅力は、堅牢なエコシステム、成熟したツール、幅広いコミュニティのサポートにあり、ウェブ、モバイル、デスクトップアプリを開発するための信頼できる選択肢となっています。</p>
        <p>
            <control>Q: Pythonはクロスプラットフォーム開発に適していますか？</control>
        </p>
        <p>A: はい。Pythonは適応性が高く、クロスプラットフォームのデスクトップアプリケーションやスクリプティングに最適です。Kivyなどのフレームワークを使用すると、開発者は単一のコードベースで複数のプラットフォームで動作するアプリを作成できます。ただし、ネイティブモバイルアプリ開発では、Kotlin、Swift、Dartなどの言語ほど広くは利用されていません。</p>
        <p>
            <control>Q: Kotlin、Flutter (Dart)、React Native (JavaScript) のどれを選べばよいですか？</control>
        </p>
        <p>A: 最適な選択肢は、以下のいくつかの重要な要因によって決まります。</p>
        <list>
            <li><p>チームの専門知識 – スタッフがすでに理解しているものを活用することで、立ち上げ時間を短縮できます。</p></li>
            <li><p>UIへのアプローチ – Flutterは高度にカスタマイズ可能なUIを提供しますが、React Nativeはネイティブコンポーネントに依存します。これらと比較して、Kotlin Multiplatformはより柔軟です。開発者は、ビジネスロジックのみを共有してUIを各プラットフォームで完全にネイティブに保つことも、Compose Multiplatformを使用してロジックとUIの両方を共有することも選択できます。</p></li>
            <li><p>パフォーマンス要件 – Kotlin（ネイティブAndroid向け）が最高のパフォーマンスを発揮し、Kotlin Multiplatformはパフォーマンスを損なうことなくクロスプラットフォーム開発を可能にします。Flutterは独自のレンダリングエンジンにより高いパフォーマンスを提供しますが、React Nativeのパフォーマンスはブリッジやアプリの複雑さによって変動する可能性があります。</p></li>
            <li><p>コミュニティとエコシステム – React Nativeが最大のエコシステムを持っていますが、Kotlin MultiplatformとFlutterも急速に拡大しています。</p></li>
            <li><p>長期的なサポート – JavaScriptは最大のエコシステムを誇り、Kotlin MultiplatformとFlutterは、それぞれJetBrainsとGoogleによる強力な後押しを受けて急速に進化しています。</p></li>
        </list>
        <p>
            <control>Q: 単一の言語を使用して、複数のプラットフォームでコードを再利用することは可能ですか？</control>
        </p>
        <p>A: はい。例えば、Kotlin Multiplatformは、ネイティブ開発の利点を維持しながら、Android、iOS、デスクトップ、ウェブ、サーバー間でコードを共有することを可能にします。Compose Multiplatformを使用すれば、UIコードも複数のプラットフォーム間で共有でき、コードの再利用を最大化できます。ただし、ハードウェアアクセス、システムAPI、OSへの深い統合など、一部のプラットフォーム依存機能には、依然としてネイティブの実装やカスタムの expect/actual モジュールが必要になる場合があります。</p>
        </chapter>
</topic>