[//]: # (title: よくある質問)

<web-summary>Kotlinは、JetBrainsが開発した簡潔なマルチプラットフォームプログラミング言語です。</web-summary>

### Kotlinとは何ですか？

Kotlinは、JVM、Android、JavaScript、Wasm、およびNativeをターゲットとするオープンソースの静的型付けプログラミング言語です。
[JetBrains](https://www.jetbrains.com)によって開発されています。プロジェクトは2010年に開始され、ごく初期からオープンソースとして公開されていました。
最初の正式な1.0リリースは2016年2月でした。

### Kotlinの現在のバージョンは何ですか？

現在リリースされているバージョンは%kotlinVersion%で、%kotlinReleaseDate%に公開されました。
詳細については、[GitHub](https://github.com/jetbrains/kotlin)で確認できます。

### Kotlinは無料ですか？

はい。Kotlinは無料で、これまでも無料であり、これからも無料であり続けます。Apache 2.0ライセンスのもとで開発されており、ソースコードは[GitHub](https://github.com/jetbrains/kotlin)で公開されています。

### Kotlinはオブジェクト指向言語ですか、それとも関数型言語ですか？

Kotlinにはオブジェクト指向と関数型の両方の構成要素があります。OOスタイルとFPスタイルの両方で使用することも、両方の要素を組み合わせることもできます。
高階関数、関数型、ラムダなどの機能に対するファーストクラスサポートにより、関数型プログラミングを行っている、または探索している場合にKotlinは優れた選択肢となります。

### Javaプログラミング言語と比較してKotlinにはどのような利点がありますか？

Kotlinはより簡潔です。おおよその見積もりでは、コード行数が約40%削減されると示されています。
また、より型安全です。たとえば、非Null許容型（non-nullable types）のサポートにより、アプリケーションがNPE (NullPointerException) に陥りにくくなります。
スマートキャスト、高階関数、拡張関数、レシーバー付きラムダなどの他の機能は、表現力豊かなコードを書く能力を提供し、DSL (ドメイン固有言語) の作成を容易にします。

### KotlinはJavaプログラミング言語と互換性がありますか？

はい。KotlinはJavaプログラミング言語と100%相互運用可能であり、既存のコードベースがKotlinと適切に連携できるようにすることに重点が置かれています。[JavaからKotlinコードを簡単に呼び出す](java-to-kotlin-interop.md)ことも、[KotlinからJavaコードを呼び出す](java-interop.md)こともできます。これにより、導入がはるかに容易になり、リスクが低減されます。また、既存のコードの移行を簡素化するために、自動化された[IDEにJava-to-Kotlin変換ツールが組み込まれています](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)。

### Kotlinは何に利用できますか？

Kotlinは、サーバーサイド、クライアントサイドWeb、Android、マルチプラットフォームライブラリなど、あらゆる種類の開発に使用できます。
Kotlin/Nativeが現在開発中であり、組み込みシステム、macOS、iOSなどの他のプラットフォームもサポートしています。
人々はKotlinをモバイルおよびサーバーサイドアプリケーション、JavaScriptまたはJavaFXを使用したクライアントサイド、データサイエンスなどに使用しており、これは可能性の一部に過ぎません。

### Android開発にKotlinを使用できますか？

はい。KotlinはAndroidでファーストクラス言語としてサポートされています。Basecamp、Pinterestなど、すでに何百ものアプリケーションがAndroidにKotlinを使用しています。詳細については、[Android開発のリソース](android-overview.md)を確認してください。

### サーバーサイド開発にKotlinを使用できますか？

はい。KotlinはJVMと100%互換性があり、そのためSpring Boot、vert.x、JSFなどの既存のフレームワークを使用できます。さらに、[Ktor](https://github.com/kotlin/ktor)など、Kotlinで書かれた特定のフレームワークもあります。詳細については、[サーバーサイド開発のリソース](server-overview.md)を確認してください。

### Web開発にKotlinを使用できますか？

はい。バックエンドWeb開発では、Kotlinは[Ktor](https://ktor.io/)や[Spring](https://spring.io/)などのフレームワークと相性が良く、サーバーサイドアプリケーションを効率的に構築できます。さらに、クライアントサイドWeb開発にはKotlin/Wasmを使用できます。
[Kotlin/Wasmの入門方法](wasm-get-started.md)を学びましょう。

### デスクトップ開発にKotlinを使用できますか？

はい。JavaFx、SwingなどのJava UIフレームワークを使用できます。
さらに、[TornadoFX](https://github.com/edvin/tornadofx)などのKotlin固有のフレームワークもあります。

### ネイティブ開発にKotlinを使用できますか？

はい。Kotlin/NativeはKotlinの一部として利用できます。KotlinをVMなしで実行できるネイティブコードにコンパイルします。
一般的なデスクトップおよびモバイルプラットフォーム、さらには一部のIoTデバイスでも試すことができます。
詳細については、[Kotlin/Nativeドキュメント](native-overview.md)を確認してください。

### どのIDEがKotlinをサポートしていますか？

Kotlinは、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)と[Android Studio](https://developer.android.com/kotlin/get-started)に、JetBrainsが開発した公式Kotlinプラグインとともに標準で完全にサポートされています。

他のIDEやコードエディターには、コミュニティサポートのKotlinプラグインしかありません。

ブラウザでKotlinコードを記述、実行、共有するには、[Kotlin Playground](https://play.kotlinlang.org)を試すこともできます。

さらに、アプリケーションのコンパイルと実行を直接サポートする[コマンドラインコンパイラ](command-line.md)も利用できます。

### どのビルドツールがKotlinをサポートしていますか？

JVMサイドでは、主要なビルドツールとして[Gradle](gradle.md)と[Maven](maven.md)があります。
クライアントサイドJavaScriptをターゲットとするビルドツールもいくつかあります。

### Kotlinは何にコンパイルされますか？

JVMをターゲットとする場合、KotlinはJava互換のバイトコードを生成します。

JavaScriptをターゲットとする場合、KotlinはES5.1にトランスパイルされ、AMDやCommonJSなどのモジュールシステムと互換性のあるコードを生成します。

Nativeをターゲットとする場合、Kotlinはプラットフォーム固有のコード（LLVM経由）を生成します。

### KotlinがターゲットとするJVMのバージョンは何ですか？

Kotlinでは、実行するJVMのバージョンを選択できます。デフォルトでは、Kotlin/JVMコンパイラはJava 8互換のバイトコードを生成します。
より新しいJavaバージョンで利用可能な最適化を利用したい場合は、ターゲットとするJavaバージョンを9から24まで明示的に指定できます。この場合、結果のバイトコードは下位バージョンでは実行できない可能性があることに注意してください。
[Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8)以降、コンパイラはJava 8より前のバージョンと互換性のあるバイトコードの生成をサポートしていません。

### Kotlinは難しいですか？

Kotlinは、Java、C#、JavaScript、Scala、Groovyなどの既存の言語から影響を受けています。Kotlinが習得しやすいように努めており、数日でKotlinを読み書きできるよう、人々が簡単に慣れることができるようにしています。
イディオマティックなKotlinを学び、より高度な機能を使用するにはもう少し時間がかかるかもしれませんが、全体としては複雑な言語ではありません。
詳細については、[弊社の学習資料](learning-materials-overview.md)を確認してください。

### どのような企業がKotlinを使用していますか？

Kotlinを使用している企業は多すぎて挙げきれませんが、ブログ投稿、GitHubリポジトリ、講演などを通じてKotlinの利用を公に表明している著名な企業には、
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、
[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/)、[Corda](https://corda.net/blog/kotlin/)などがあります。

### Kotlinを開発しているのは誰ですか？

Kotlinは、[JetBrainsのエンジニアチーム（現在のチーム規模は100人以上）](https://www.jetbrains.com/)によって開発されています。
リード言語デザイナーはMichail Zarečenskijです。コアチームに加えて、GitHubには250人以上の外部貢献者もいます。

### Kotlinについてもっと詳しく学ぶにはどうすればよいですか？

始めるのに最適な場所は[当社のウェブサイト](https://kotlinlang.org)です。
Kotlinを始めるには、[公式IDE](kotlin-ide.md)のいずれかをインストールするか、[オンラインで試す](https://play.kotlinlang.org)ことができます。

### Kotlinに関する書籍はありますか？

Kotlinに関する書籍は多数あります。その中には、弊社でレビューし、始めるのにおすすめできるものもあります。[書籍](books.md)ページにリストされています。
その他の書籍については、コミュニティが管理する[kotlin.link](https://kotlin.link/)のリストをご覧ください。

### Kotlinのオンラインコースはありますか？

JetBrains Academyの[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)で、実用的なアプリケーションを作成しながらKotlinの基本をすべて学ぶことができます。

受講できるその他のコースをいくつか紹介します。
*   Kevin Jonesによる[Pluralsightコース: Getting Started with Kotlin](https://www.pluralsight.com/courses/kotlin-getting-started)
*   Hadi Haririによる[O'Reillyコース: Introduction to Kotlin Programming](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)
*   Peter Sommerhoffによる[Udemyコース: 10 Kotlin Tutorials for Beginners](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)

[当社のYouTubeチャンネル](https://www.youtube.com/c/Kotlin)で、他のチュートリアルやコンテンツも確認できます。

### Kotlinにはコミュニティがありますか？

はい！Kotlinには非常に活発なコミュニティがあります。Kotlin開発者は、[Kotlinフォーラム](https://discuss.kotlinlang.org)、
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)などで交流しており、より活発なのは[Kotlin Slack](https://slack.kotlinlang.org)です
（2020年4月現在、30000人近くのメンバーがいます）。

### Kotlinのイベントはありますか？

はい！現在、Kotlinに特化した多くのユーザーグループやミートアップが存在します。[ウェブサイトにリスト](https://kotlinlang.org/user-groups/user-group-list.html)があります。
さらに、世界中でコミュニティ主催の[Kotlin Nights](https://kotlinlang.org/community/events.html)イベントが開催されています。

### Kotlinのカンファレンスはありますか？

はい！[KotlinConf](https://kotlinconf.com/)は、JetBrainsが主催する年次カンファレンスで、世界中の開発者、愛好家、専門家が一堂に会し、Kotlinに関する知識と経験を共有します。

KotlinConfでは、技術講演やワークショップに加えて、ネットワーキングの機会、コミュニティ交流、ソーシャルイベントも提供され、参加者は他のKotlinerとつながり、アイデアを交換できます。
これは、Kotlinエコシステム内でのコラボレーションとコミュニティ構築を促進するためのプラットフォームとして機能します。

Kotlinは世界中の様々なカンファレンスでも取り上げられています。[今後の講演のリスト](https://kotlinlang.org/community/talks.html?time=upcoming)はウェブサイトで確認できます。

### Kotlinはソーシャルメディアにありますか？

はい。
[Kotlin YouTubeチャンネル](https://www.youtube.com/c/Kotlin)を購読し、[Twitter](https://twitter.com/kotlin)または[Bluesky](https://bsky.app/profile/kotlinlang.org)でKotlinをフォローしてください。

### 他にオンラインKotlinリソースはありますか？

ウェブサイトには、コミュニティメンバーによる[Kotlin Digests](https://kotlin.link)、[ニュースレター](http://kotlinweekly.net)、[ポッドキャスト](https://talkingkotlin.com)など、多数の[オンラインリソース](https://kotlinlang.org/community/)があります。

### HDのKotlinロゴはどこで入手できますか？

ロゴは[こちら](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)からダウンロードできます。
ロゴを使用する際は、アーカイブ内の`guidelines.pdf`に記載されている簡単なルールと[Kotlinブランド利用ガイドライン](https://kotlinfoundation.org/guidelines/)に従ってください。

詳細については、[Kotlinブランドアセット](kotlin-brand-assets.md)のページを確認してください。