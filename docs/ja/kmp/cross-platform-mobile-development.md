<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="cross-platform-mobile-development"
       title="クロスプラットフォームモバイル開発とは何ですか？"
       help-id="cross-platform-mobile-development">
    <web-summary>クロスプラットフォームモバイル開発の定義、フレームワークの比較（Kotlin Multiplatform、Flutter、React Native）、およびケーススタディについて説明します。</web-summary>
    <p>今日、多くの企業が、AndroidとiOSの両方のプラットフォームに向けてモバイルアプリを構築するという課題に直面しています。そのため、クロスプラットフォームモバイル開発ソリューションが、最も人気のあるソフトウェア開発トレンドの1つとして浮上しています。</p>
    <p>最近の<a href="https://42matters.com/stats">アプリマーケットプレイスのデータ</a>によると、Google Playストアには230万個以上、Apple App Storeには約220万個のアプリが存在しており、AndroidとiOSが引き続き<a href="https://gs.statcounter.com/os-market-share/mobile/worldwide">世界のモバイルアプリの配布と利用</a>を独占しています。</p>
    <p>AndroidとiOSの両方のユーザーにリーチできるモバイルアプリを作成するには、どうすればよいでしょうか？この記事では、なぜますます多くのモバイルエンジニアがクロスプラットフォーム、あるいはマルチプラットフォームのモバイル開発アプローチを選択しているのかについて説明します。</p>
    <chapter title="クロスプラットフォームモバイル開発：定義とソリューション" id="cross-platform-mobile-development-definition-and-solutions">
        <p>クロスプラットフォームモバイル開発（マルチプラットフォームモバイル開発とも呼ばれます）は、単一の共有コードベースを使用して、複数のプラットフォーム向けのアプリケーションを構築できるようにするアプローチです。完全に別々の2つのネイティブアプリを開発・保守する代わりに、エンジニアはプラットフォーム間で再利用可能な共通コードを記述します。</p>
        <p>現代的な<a href="cross-platform-frameworks.topic">クロスプラットフォームフレームワーク</a>を使用すると、開発者はアプリのロジックの大部分を一度記述するだけで、それをAndroidとiOSの両方で共有でき、重複する作業を大幅に削減してリリースを加速できます。例えば、<a href="kmp-overview.md">Kotlin Multiplatform</a>を使用すると、エンジニアはすべてのビジネスロジックを再利用でき、Compose Multiplatformを使用すれば、プラットフォーム間でUIコードまでも共有できます。</p>
        <p><a href="https://kotlinlang.org/multiplatform/"><img src="discover-kmp.svg" alt="Kotlin Multiplatform を見つける" width="600"/></a></p>
        <p>この高いレベルのコード共有は、プラットフォーム間での一貫したユーザーエクスペリエンスの確保、重複する開発作業の削減、および長期的なメンテナンスコストの低減に役立ちます。同時に、現代的なフレームワークでは、必要に応じてネイティブAPIやプラットフォーム固有の機能へのアクセスを維持することができます。</p>
        <p>コードの再利用とネイティブ統合を組み合わせることで、クロスプラットフォーム開発は、AndroidとiOSの両方のユーザーに効率的にリーチすることを目指す企業にとって、バランスの取れたソリューションを提供します。</p>
        <chapter title="モバイルアプリ開発への異なるアプローチ" id="different-approaches-to-mobile-app-development">
            <p>クロスプラットフォームソリューションは、過去10年間で大きく進化しました。Apache CordovaやIonicのような初期のハイブリッドツールは、ウェブベースのコードをプラットフォーム間で共有することを可能にしましたが、パフォーマンスが制限されたり、ユーザーエクスペリエンスが不十分だったりすることがよくありました。Kotlin MultiplatformやFlutterのような現代的なコンパイル型フレームワークは、幅広いコード再利用を実現しながらネイティブに近いパフォーマンスを提供し、ネイティブプラットフォームの機能へのより深いアクセスを可能にします。</p>
            <p>AndroidとiOSの両方に対応するアプリケーションを作成するには、主に以下の方法があります。</p>
              <list type="none">
                  <li><a href="#1-separate-native-apps-for-each-operating-system">個別のネイティブアプリ</a></li>
                  <li><a href="#2-progressive-web-apps-pwas">プログレッシブウェブアプリ（PWA）</a></li>
                  <li><a href="#3-cross-platform-apps">クロスプラットフォームアプリ</a></li>
                  <li><a href="#4-hybrid-apps">ハイブリッドアプリ</a></li>
              </list>
            <chapter title="1. オペレーティングシステムごとの個別のネイティブアプリ" id="1-separate-native-apps-for-each-operating-system">
                <p>ネイティブアプリを作成する場合、開発者は特定のオペレーティングシステム用のアプリケーションを構築し、そのプラットフォーム専用に設計されたツールとプログラミング言語（AndroidならKotlinまたはJava、iOSならSwiftまたはObjective-C）を使用します。</p>
                <p>これらのツールと言語を使用することで、特定のOSの機能や能力にアクセスでき、直感的なインターフェースを備えたレスポンシブなアプリを構築できます。しかし、AndroidとiOSの両方のユーザーにリーチしたい場合は、別々のアプリケーションを作成する必要があり、それには多大な時間と労力がかかります。</p>
            </chapter>
            <chapter title="2. プログレッシブウェブアプリ（PWA）" id="2-progressive-web-apps-pwas">
                <p>プログレッシブウェブアプリ（PWA）は、モバイルアプリの機能とウェブ開発で使用されるソリューションを組み合わせたものです。大まかに言えば、ウェブサイトとモバイルアプリケーションをミックスしたようなものです。開発者は、JavaScript、HTML、CSS、WebAssemblyなどのウェブテクノロジーを使用してPWAを構築します。</p>
                <p>ウェブアプリケーションは個別のパッケージ化や配布を必要とせず、オンラインで公開できます。コンピュータ、スマートフォン、タブレットのブラウザ経由でアクセスでき、Google PlayやApp Store経由でインストールする必要はありません。</p>
                <p>ここでの欠点は、ユーザーがアプリを使用している間に、連絡先、カレンダー、電話、その他の資産など、デバイスのすべての機能を利用できるわけではなく、ユーザーエクスペリエンスが制限されることです。アプリのパフォーマンスの面では、ネイティブアプリが優位に立っています。</p>
            </chapter>
            <chapter title="3. クロスプラットフォームアプリ" id="3-cross-platform-apps">
                <p>前述のように、マルチプラットフォームアプリは、異なるモバイルプラットフォームで同一に動作するように設計されています。クロスプラットフォームフレームワークを使用すると、このようなアプリを開発するために、共有可能で再利用可能なコードを記述できます。</p>
                <p>このアプローチには、時間とコストの両面での効率性など、いくつかの利点があります。クロスプラットフォームモバイル開発のメリットとデメリットについては、後のセクションで詳しく見ていきます。</p>
            </chapter>
            <chapter title="4. ハイブリッドアプリ" id="4-hybrid-apps">
                <p>ウェブサイトやフォーラムを閲覧していると、<emphasis>クロスプラットフォームモバイル開発</emphasis>と<emphasis>ハイブリッドモバイル開発</emphasis>という用語を同じ意味で使用している人がいることに気づくかもしれません。しかし、そうすることは完全に正確ではありません。</p>
                <p>クロスプラットフォームアプリの場合、モバイルエンジニアは一度コードを記述すれば、それを異なるプラットフォームで再利用できます。一方、ハイブリッドアプリ開発は、ネイティブ技術とウェブ技術を組み合わせたアプローチです。HTML、CSS、JavaScriptなどのウェブ開発言語で記述されたコードをネイティブアプリに埋め込む必要があります。これは、Ionic CapacitorやApache Cordovaなどのフレームワークを使用し、プラットフォームのネイティブ機能にアクセスするための追加プラグインを利用することで実現できます。</p>
                <p>クロスプラットフォーム開発とハイブリッド開発の唯一の共通点は、コードの共有可能性です。パフォーマンスの面では、ハイブリッドアプリケーションはネイティブアプリと同等ではありません。ハイブリッドアプリは単一のコードベースをデプロイするため、一部の機能が特定のOSに特有であり、他のOSではうまく機能しないことがあります。</p>
            </chapter>
        </chapter>
        <chapter title="ネイティブかクロスプラットフォームか：長年の議論" id="native-or-cross-platform-app-development-a-longstanding-debate">
            <p><a href="native-and-cross-platform.topic">ネイティブ開発とクロスプラットフォーム開発をめぐる議論</a>は、テックコミュニティにおいて未だ解決されていません。どちらのテクノロジーも絶えず進化しており、それぞれに独自の利点と制限があります。</p>
            <p>一部の専門家は依然として、マルチプラットフォームソリューションよりもネイティブモバイル開発を好んでおり、ネイティブアプリの強力なパフォーマンスと優れたユーザーエクスペリエンスを最も重要なメリットの1つとして挙げています。</p>
            <p>しかし、現代の多くの企業は、AndroidとiOSの両方で機能をより迅速にリリースする必要があります。そこで、Kotlin Multiplatformのようなクロスプラットフォーム開発テクノロジーが役立ちます。Duolingoのような企業は、すでにその<a href="https://youtu.be/RJtiFt5pbfs?si=jNBydHcHPw-IIEVZ">影響を実感しています</a>。同社のクライアントプラットフォームチームのJohn Rodriguez氏は次のように述べています。</p>
            <note>
                <p>Duolingoにとって刺激的なトレンドの1つは、社内で Kotlin Multiplatform を使えば使うほど、リリースのスピードが上がっていることに気づいたことです。何かを学んだ後は、それが本当に得意になるものです。[...] 今では、それに対する自信がはるかに深まり、知識も蓄積されています。</p>
            </note>
            <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="Kotlin Multiplatform のケーススタディを探索する" width="600"/></a></p>
        </chapter>
    </chapter>
    <chapter title="クロスプラットフォームモバイル開発はあなたに適していますか？" id="is-cross-platform-mobile-development-right-for-you">
        <p>クロスプラットフォーム開発は、技術的な理由だけでなく、ビジネス上の利点からも選ばれることがよくあります。プラットフォーム間でコードを共有することで、チームは重複する開発作業を減らし、機能の提供を加速させ、長期的なメンテナンスを簡素化できます。</p>
        <chapter title="クロスプラットフォームモバイル開発のメリット" id="benefits-of-cross-platform-mobile-development">
            <p>企業が他の選択肢よりもこのアプローチを選択する理由はたくさんあります。</p>
              <list type="none">
                  <li><a href="#1-reusable-code">再利用可能なコード</a></li>
                  <li><a href="#2-time-savings">時間の節約</a></li>
                  <li><a href="#3-effective-resource-management">効果的なリソース管理</a></li>
                  <li><a href="#4-attractive-opportunities-for-developers">開発者にとって魅力的な機会</a></li>
                  <li><a href="#5-opportunity-to-reach-wider-audiences">より広いオーディエンスにリーチする機会</a></li>
                  <li><a href="#6-quicker-time-to-market-and-customization">迅速な市場投入とカスタマイズ</a></li>
              </list>
            <chapter title="1. 再利用可能なコード" id="1-reusable-code">
                <p>クロスプラットフォームプログラミングを使用すると、モバイルエンジニアはオペレーティングシステムごとに新しいコードを記述する必要がありません。単一のコードベースを使用することで、開発者はAPI呼び出し、データストレージ、データのシリアライズ、アナリティクスの実装といった反復的なタスクに費やす時間を短縮できます。</p>
                <p>Kotlin Multiplatformのようなテクノロジーを使用すると、アプリのデータ、ビジネス、プレゼンテーションレイヤーを一度だけ実装できます。あるいは、KMPを段階的に導入することも可能です。フィルタリングやソートなど、頻繁に変更され、通常同期が取れなくなるロジックの一部を選択してクロスプラットフォーム化し、共有モジュールとしてプロジェクトに接続します。</p>
                <p>JetBrainsでは、定期的にKotlin Multiplatformのアンケートを実施し、コミュニティメンバーに異なるプラットフォーム間でコードのどの部分を共有しているかを尋ねています。</p>
                <img src="survey-results-q1-q2-22.png" alt="Kotlin Multiplatform ユーザーがプラットフォーム間で共有できるコードの部分" width="700"/>
            </chapter>
            <chapter title="2. 時間の節約" id="2-time-savings">
                <p>アプリケーションロジックの大部分をプラットフォーム間で共有できるため、開発者は重複する機能の実装を削減できます。これにより、開発の手間が軽減され、チームは新しい機能を両方のプラットフォームにより迅速に提供できるようになります。</p>
            </chapter>
            <chapter title="3. 効果的なリソース管理" id="3-effective-resource-management">
                <p>単一のコードベースを持つことは、チームがリソースをより効率的に管理するのに役立ちます。AndroidとiOSで別々のコードベースと開発ワークフローを維持する代わりに、チームは共有コンポーネントで協力し、作業の重複ではなく製品機能の構築に集中できます。</p>
            </chapter>
            <chapter title="4. 開発者にとって魅力的な機会" id="4-attractive-opportunities-for-developers">
                <p>多くのモバイルエンジニアは、現代的なクロスプラットフォームテクノロジーを製品の技術スタックにおける魅力的な要素と見なしています。JSONのパースなど、反復的で日常的なタスクを実行しなければならない場合、開発者は仕事に退屈してしまうことがあります。しかし、新しいテクノロジーやタスクは、彼らの興奮、モチベーション、そして仕事への喜びを取り戻させることができます。このように、現代的な技術スタックを持つことは、実際にモバイル開発チームの人員を確保し、彼らの意欲と熱意をより長く維持することを容易にします。</p>
            </chapter>
            <chapter title="5. より広いオーディエンスにリーチする機会" id="5-opportunity-to-reach-wider-audiences">
                <p>異なるプラットフォームの間で選択をする必要はありません。アプリが複数のオペレーティングシステムに対応しているため、AndroidとiOSの両方のユーザーのニーズを満たし、リーチを最大化できます。</p>
            </chapter>
            <chapter title="6. 迅速な市場投入とカスタマイズ" id="6-quicker-time-to-market-and-customization">
                <p>プラットフォームごとに異なるアプリを構築する必要がないため、製品をより迅速に開発し、リリースできます。さらに、アプリケーションのカスタマイズや変換が必要な場合、プログラマーがコードベースの特定の部分に小さな変更を加えるのが容易になります。これにより、ユーザーからのフィードバックに対してもより迅速に対応できるようになります。</p>
            </chapter>
        </chapter>
        <chapter title="クロスプラットフォーム開発アプローチの課題" id="challenges-of-a-cross-platform-development-approach">
            <p>すべてのソリューションには独自の制限があります。テックコミュニティの一部では、クロスプラットフォームプログラミングはいまだにパフォーマンスに苦労しているという意見もあります。さらに、プロジェクトリーダーは、開発プロセスの最適化に集中しすぎることが、アプリのユーザーエクスペリエンスに悪影響を及ぼすのではないかという懸念を抱くかもしれません。</p>
            <p>しかし、基盤となるテクノロジーの改善により、クロスプラットフォームソリューションはますます安定し、適応性と柔軟性が高まっています。</p>
            <p>よく聞かれるもう1つの懸念は、マルチプラットフォーム開発ではプラットフォームのネイティブ機能をシームレスにサポートすることが不可能であるという点です。しかし、Kotlin Multiplatformでは、Kotlinの<a href="multiplatform-expect-actual.md">expected および actual 宣言</a>を使用して、マルチプラットフォームアプリがプラットフォーム固有のAPIにアクセスできるようにすることができます。expected および actual 宣言を使用すると、共通コード内で複数のプラットフォームにわたって同じ関数を呼び出すことができるように「期待（expect）」することを定義し、JavaやObjective-C/SwiftとのKotlinの相互運用性のおかげで、任意のプラットフォーム固有のライブラリと対話できる「実際（actual）」の実装を提供できます。</p>
            <p>現代のマルチプラットフォームフレームワークが進化し続けるにつれ、モバイルエンジニアはネイティブのような体験を構築できるようになっています。アプリが適切に記述されていれば、ユーザーはその違いに気づくことはないでしょう。ただし、製品の品質は、選択するクロスプラットフォームアプリ開発ツールに大きく依存します。</p>
        </chapter>
    </chapter>
    <chapter title="クロスプラットフォームフレームワークの比較" id="cross-platform-framework-comparison">
        <p>いくつかのフレームワークにより、開発者は共有コードベースを使用してクロスプラットフォームモバイルアプリケーションを構築できます。これらはすべてAndroidとiOS開発間の重複作業を減らすことを目的としていますが、プログラミング言語、レンダリング手法、パフォーマンス特性、およびエコシステムの成熟度の点で異なります。</p>
        <p>以下の概要では、今日最も広く使用されているクロスプラットフォームフレームワークのいくつかを比較しています。</p>
        <table style="both">
            <tr>
                <td width="160"></td>
                <td width="50"><b>言語</b></td>
                <td width="230"><b>プラットフォーム間でのコード共有</b></td>
                <td width="140"><b>コミュニティの成熟度</b></td>
                <td width="130"><b>アプリの例</b></td>
            </tr>
            <tr>
                <td><b>Kotlin Multiplatform</b></td>
                <td>Kotlin</td>
                <td>
                    必要に応じてネイティブプラットフォームのコードを保持しながら、
                    ビジネスロジックとUIをプラットフォーム間で
                    柔軟に共有可能。
                </td>
                <td>急速に成長中</td>
                <td>
                    Duolingo, McDonald's,
                    Forbes, Philips,
                    H&amp;M, Bolt
                </td>
            </tr>
            <tr>
                <td><b>Flutter</b></td>
                <td>Dart</td>
                <td>
                    ほとんどのアプリケーションロジックとUIを
                    単一のDartコードベース内で共有。
                </td>
                <td>大規模かつ成熟</td>
                <td>
                    eBay Motors, Alibaba,
                    Google Pay,
                    ByteDance アプリ
                </td>
            </tr>
            <tr>
                <td><b>React Native</b></td>
                <td>
                    JavaScript,
                    TypeScript
                </td>
                <td>
                    個別の機能から完全なアプリケーションまで、
                    ビジネスロジックとUIコンポーネントを
                    プラットフォーム間で共有。
                </td>
                <td>大規模かつ成熟</td>
                <td>
                    Microsoft Office, Teams,
                    Xbox Game Pass;
                    Facebook, Instagram
                </td>
            </tr>
            <tr>
                <td><b>.NET MAUI</b></td>
                <td>C#, XAML</td>
                <td>
                    単一のC#コードベース内で
                    ビジネスロジックとUIを
                    プラットフォーム間で共有。
                </td>
                <td>確立されている</td>
                <td>
                    NBC Sports Next,
                    Escola Agil,
                    Azure App
                </td>
            </tr>
            <tr>
                <td><b>Ionic</b></td>
                <td>JavaScript</td>
                <td>
                    ほとんどのアプリケーションロジックとUIを
                    単一のウェブベースのコードベースで共有し、
                    ネイティブ機能はプラグイン経由でアクセス。
                </td>
                <td>成熟</td>
                <td>
                    T-Mobile,
                    BBC (子供向けアプリ),
                    EA Games
                </td>
            </tr>
            <tr>
                <td><b>NativeScript</b></td>
                <td>
                    JavaScript,
                    TypeScript
                </td>
                <td>
                    単一のJavaScriptまたはTypeScript
                    コードベース内で、ほとんどのアプリケーション
                    ロジックとUIをプラットフォーム間で共有。
                </td>
                <td>確立されている</td>
                <td>
                    Daily Nanny,
                    Groov, Breethe
                </td>
            </tr>
        </table>
        <p>また、<a href="cross-platform-frameworks.topic">最も人気のあるクロスプラットフォームテクノロジー</a>のより詳細な概要も確認できます。</p>
        <p><b>Kotlin Multiplatform</b></p>
        <p>Kotlin Multiplatformは、Kotlinを使用してチームがプラットフォーム間でアプリケーションロジックを共有できるようにします。Compose Multiplatformを使用すると、開発者は必要に応じてネイティブAPIと統合しながら、UIを含むアプリケーションコードの最大100%を共有できます。このアプローチにより、チームはネイティブの能力を維持しながら、単一のコードベースからAndroid、iOS、デスクトップ、およびウェブ向けのアプリケーションを構築できます。</p>
        <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="Kotlin Multiplatform を始める" width="600"/></a></p>
        <p><b>Flutter</b></p>
        <p>FlutterはGoogleによって作成されたクロスプラットフォームフレームワークで、Dartプログラミング言語と独自のレンダリングエンジンを使用します。UIレンダリングレイヤーを制御するため、Flutterは異なるプラットフォーム間で一貫したビジュアルと強力なパフォーマンスを提供できます。<a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform と Flutter</a>を詳細に比較検討し、それらの能力をより深く理解して、クロスプラットフォームプロジェクトに適したものを判断してください。</p>
        <p><b>React Native</b></p>
        <p>React Nativeは、開発者がJavaScriptとReactライブラリを使用してモバイルアプリを構築できるようにします。JavaScriptランタイムを通じてロジックを実行しながらネイティブUIコンポーネントをレンダリングするため、ウェブ開発の経験があるチームの間で人気があります。製品とチームに最適なものを選択するのに役立つ、<a href="kotlin-multiplatform-react-native.topic">Kotlin Multiplatform と React Native</a>の概要を確認してください。</p>
        <p><b>.NET MAUI</b></p>
        <p>.NET MAUIは、C#と.NETエコシステムを使用してネイティブのモバイルおよびデスクトップアプリケーションを構築するためのMicrosoftのクロスプラットフォームフレームワークです。開発者は単一のコードベースからAndroid、iOS、macOS、およびWindowsをターゲットにでき、Visual Studioなどのツールと密接に統合されています。</p>
        <p><b>Ionic</b></p>
        <p>Ionicは、HTML、CSS、JavaScriptなどのウェブテクノロジーを使用するハイブリッドモバイルフレームワークです。アプリケーションはWebView内で実行され、プラグインまたはネイティブブリッジを通じてデバイス機能にアクセスします。Ionicは、強力なウェブ開発の背景を持つチームにとって優れた選択肢となります。</p>
        <p><b>NativeScript</b></p>
        <p>NativeScriptは、JavaScriptまたはTypeScriptを使用してネイティブモバイルアプリを構築するためのオープンソースフレームワークです。本物のネイティブUIコンポーネントをレンダリングし、プラットフォームAPIへの直接アクセスを提供するため、開発者はネイティブのパフォーマンスとユーザーエクスペリエンスを備えたクロスプラットフォームアプリを作成できます。</p>
    </chapter>
    <chapter title="実世界での Kotlin Multiplatform の例" id="real-world-kotlin-multiplatform-examples">
        <p>Duolingo、McDonald's、Netflix、9GAG、VMware、Cash App、Philips、その他多くの大企業が、ネイティブのパフォーマンスとプラットフォーム固有のユーザーエクスペリエンスを維持しながら効率性を享受するために、<a href="use-cases-examples.md">Kotlin Multiplatform をますます採用しています</a>。既存のKotlinコードの特定の重要なセグメントを共有することでアプリの安定性を高めることを選択している企業もあれば、アプリの品質を損なうことなくコードの再利用を最大化し、各プラットフォームでネイティブUIを維持しながら、モバイル、デスクトップ、ウェブ、テレビにわたってすべてのアプリケーションロジックを共有することを目指している企業もあります。このアプローチの利点は、すでにそれを採用した企業のストーリーから明らかです。</p>
        <p><b>Duolingo</b></p>
        <p>Duolingoは、モバイルプラットフォーム全体での開発を加速させるために Kotlin Multiplatform を使用しています。同社は176か国の4,000万人以上のデイリーアクティブユーザーに対し、AndroidとiOSの両方で毎週アップデートをリリースしており、Kotlin Multiplatform がプラットフォーム間での機能提供を迅速化するのに役立っていると報告しています。<a href="https://youtu.be/RJtiFt5pbfs?si=b8mndETdH-tplZQA">ビデオ全編を見る</a>。</p>
        <p><b>McDonald’s</b></p>
        <p>McDonald's アプリの背後にあるUmainチームは、当初支払い機能に Kotlin Multiplatform を採用し、その後モバイルアプリケーション全体に拡大しました。共有のKotlinコードを導入した後、チームはクラッシュが減少し、プラットフォーム間でのパフォーマンスが向上したと報告しました。この移行は、チームがAndroidとiOSの別々のチームから、より統合されたモバイル開発チームへと移行するのにも役立ちました。<a href="https://youtu.be/uCkYZ-PvCmw?si=eLG2rmq5Hw3yvt0i">ビデオ全編を見る</a>。</p>
        <p><b>Forbes</b></p>
        <p>iOSとAndroidの間でロジックの80%以上を共有することにより、Forbesは現在、新機能を両方のプラットフォームで同時にリリースしながら、特定のプラットフォームに基づいた機能のカスタマイズという柔軟性も維持しています。これにより、チームはより迅速に革新し、市場のニーズに対応できるようになりました。<a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">ストーリー全編を読む</a>。</p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="Kotlin Multiplatform のケーススタディを探索する" width="600"/></a></p>
        <p>また、<a href="multiplatform-reasons-to-try.md">開発者が既存または新規のプロジェクトで Kotlin Multiplatform の使用を検討すべき理由</a>と、なぜそれが勢いを増し続けているのかについても確認できます。</p>
    </chapter>
    <chapter title="よくある質問" id="frequently-asked-questions">
        <p><b>Q: クロスプラットフォームモバイル開発とは何ですか？</b></p>
        <p>A: クロスプラットフォームモバイル開発（クロスプラットフォームアプリ開発とも呼ばれます）は、1つのコードベースを使用して、複数のオペレーティングシステム（iOSやAndroidなど）で動作するアプリケーションを構築できるようにするアプローチです。プラットフォーム間でコードを共有することで、開発者はコストを削減し、より迅速に市場に投入できます。</p>
        <p><b>Q: クロスプラットフォームフレームワークをどのように選べばよいですか？</b></p>
        <p>A: チームのスキル、プロジェクトの要件、および長期的な製品目標に基づいてクロスプラットフォームフレームワークを選択してください。例えば、Kotlin Multiplatform は、特に共有UIコードに Compose Multiplatform を使用する場合、パフォーマンス、保守性、およびネイティブなルック＆フィールを重視するチームにとって非常に魅力的です。React Native は、JavaScriptやReactの経験があるチーム、特に迅速なプロトタイピングによく好まれます。.NET MAUI は、.NET エコシステムで作業する開発者にとって強力な選択肢です。</p>
        <p><b>Q: Kotlin Multiplatform と Compose Multiplatform の違いは何ですか？</b></p>
        <p>A: <a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform</a> は、Android、iOS、デスクトップ、ウェブ、サーバーを含む複数のプラットフォーム間でコードを共有できるようにするコアテクノロジーです。これは、望まない限りネイティブUIを置き換えることなく、コードの再利用に焦点を当てています。<a href="https://kotlinlang.org/compose-multiplatform/">Compose Multiplatform</a> は、Kotlin Multiplatform の上に構築されたオプションのUIフレームワークです。これにより、Androidの Jetpack Compose に似た現代的な宣言型アプローチを使用して、プラットフォーム間でユーザーインターフェースを共有できます。これを使用して、単一のコードベースから Android、iOS、デスクトップ、およびウェブ向けの視覚的に魅力的でレスポンシブなUIを構築できます。</p>
        <p><b>Q: 最も人気のあるモバイル開発フレームワークは何ですか？</b></p>
        <p>A: クロスプラットフォームモバイルアプリ開発で人気のあるフレームワークには、Kotlin Multiplatform、Flutter、React Native、.NET MAUI などがあります。ニーズに最適なものを見つけるために、<a href="cross-platform-frameworks.topic">最も人気のあるクロスプラットフォームテクノロジーの概要</a>を確認できます。</p>
        <p>新しいマルチプラットフォームテクノロジーを採用する際の手助けが必要な場合は、ガイド「<a href="multiplatform-introduce-your-team.md"><i>チームにマルチプラットフォーム開発を導入する方法</i></a>」を確認することをお勧めします。</p>
        <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="Kotlin Multiplatform を始める" width="600"/></a></p>
    </chapter>
    <chapter title="結論" id="conclusion">
        <p>クロスプラットフォーム開発ソリューションが進化し続けるにつれ、その制限は、提供されるメリットと比較して些細なものになり始めています。市場にはさまざまなテクノロジーが存在し、それぞれが異なるワークフローや要件に適しています。この記事で取り上げた各ツールは、クロスプラットフォームを試してみようと考えているチームに対して広範なサポートを提供しています。</p>
        <p>最終的には、特定のビジネスニーズ、目的、タスクを慎重に検討し、アプリで達成したい明確な目標を策定することが、あなたにとって最適なソリューションを特定するのに役立ちます。</p>
    </chapter>
</topic>