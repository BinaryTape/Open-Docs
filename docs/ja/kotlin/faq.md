[//]: # (title: よくある質問)
[//]: # (description: Kotlinは、JetBrainsが開発した簡潔なマルチプラットフォームプログラミング言語です。)

### Kotlinとは何ですか？

Kotlinは、JVM、Android、JavaScript、Wasm、およびNativeをターゲットとするオープンソースの静的型付けプログラミング言語です。
[JetBrains](https://www.jetbrains.com)によって開発されています。プロジェクトは2010年に始まり、非常に早い段階からオープンソースでした。
最初の公式1.0リリースは2016年2月でした。

### Kotlinの現在のバージョンは何ですか？

現在リリースされているバージョンは%kotlinVersion%で、%kotlinReleaseDate%に公開されました。
詳細については、[GitHub](https://github.com/jetbrains/kotlin)をご覧ください。

### Kotlinは無料ですか？

はい。Kotlinは無料であり、これまでも無料であり、今後も無料です。Apache 2.0ライセンスの下で開発されており、ソースコードは[GitHub](https://github.com/jetbrains/kotlin)で公開されています。

### Kotlinはオブジェクト指向言語ですか、それとも関数型言語ですか？

Kotlinには、オブジェクト指向と関数型の両方の構文があります。OOスタイルとFPスタイルの両方で使用することも、両方の要素を混ぜて使用することもできます。
高階関数、関数型、ラムダなどの機能がファーストクラスでサポートされているため、関数型プログラミングを実践または探求している場合にKotlinは優れた選択肢となります。

### Javaプログラミング言語と比較して、Kotlinにはどのような利点がありますか？

Kotlinはより簡潔です。おおよその見積もりでは、コード行数が約40%削減されることを示しています。
また、型安全性が高く、たとえば非null許容型のサポートにより、アプリケーションはNPE（NullPointerException）の発生を抑制できます。
スマートキャスト、高階関数、拡張関数、レシーバー付きラムダなどの他の機能は、表現力豊かなコードを書く能力を提供し、DSLの作成を容易にします。

### KotlinはJavaプログラミング言語と互換性がありますか？

はい。KotlinはJavaプログラミング言語と100%相互運用可能であり、既存のコードベースがKotlinと適切にやり取りできることを保証することに重点が置かれています。
[JavaからKotlinコードを呼び出す](java-to-kotlin-interop.md)ことや、[KotlinからJavaコードを呼び出す](java-interop.md)ことが簡単にできます。これにより、導入がはるかに容易になり、リスクが低減されます。
また、既存のコードの移行を簡素化する自動化された[Java-to-KotlinコンバーターがIDEに組み込まれています](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)。

### Kotlinは何に使えますか？

Kotlinは、サーバーサイド、クライアントサイドWeb、Android、マルチプラットフォームライブラリなど、あらゆる種類の開発に使用できます。
現在開発中のKotlin/Nativeにより、組み込みシステム、macOS、iOSなどの他のプラットフォームもサポートされています。
人々はモバイルおよびサーバーサイドアプリケーション、JavaScriptまたはJavaFXを使用したクライアントサイド、データサイエンスなどにKotlinを使用しています。

### Android開発にKotlinを使用できますか？

はい。KotlinはAndroidでファーストクラス言語としてサポートされています。Basecamp、Pinterestなど、AndroidでKotlinを使用しているアプリケーションはすでに数百あります。
詳細については、[Android開発のリソース](android-overview.md)をご覧ください。

### サーバーサイド開発にKotlinを使用できますか？

はい。KotlinはJVMと100%互換性があり、そのためSpring Boot、vert.x、JSFなどの既存のフレームワークを使用できます。
さらに、[Ktor](https://github.com/kotlin/ktor)など、Kotlinで書かれた特定のフレームワークもあります。
詳細については、[サーバーサイド開発のリソース](server-overview.md)をご覧ください。

### Web開発にKotlinを使用できますか？

はい。バックエンドWeb開発では、Kotlinは[Ktor](https://ktor.io/)や[Spring](https://spring.io/)などのフレームワークと連携して動作し、サーバーサイドアプリケーションを効率的に構築できます。
さらに、クライアントサイドWeb開発にはKotlin/Wasmを使用できます。
[Kotlin/Wasmの開始方法](wasm-get-started.md)を学びましょう。

### デスクトップ開発にKotlinを使用できますか？

はい。JavaFX、Swingなどの任意のJava UIフレームワークを使用できます。
さらに、[TornadoFX](https://github.com/edvin/tornadofx)など、Kotlinに特化したフレームワークもあります。

### ネイティブ開発にKotlinを使用できますか？

はい。Kotlin/NativeはKotlinの一部として利用可能です。KotlinをVMなしで実行できるネイティブコードにコンパイルします。
人気のデスクトップおよびモバイルプラットフォーム、さらには一部のIoTデバイスで試すことができます。
詳細については、[Kotlin/Nativeドキュメント](native-overview.md)をご覧ください。

### どのようなIDEがKotlinをサポートしていますか？

Kotlinは、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)および[Android Studio](https://developer.android.com/kotlin/get-started)でJetBrainsが開発した公式Kotlinプラグインにより、すぐに使える完全なサポートを提供します。

他のIDEやコードエディターには、Kotlinコミュニティがサポートするプラグインのみがあります。

また、ブラウザでKotlinコードを記述、実行、共有するには[Kotlin Playground](https://play.kotlinlang.org)を試すこともできます。

さらに、アプリケーションのコンパイルと実行を直接サポートする[コマンドラインコンパイラ](command-line.md)も利用可能です。

### どのようなビルドツールがKotlinをサポートしていますか？

JVM側では、主なビルドツールには[Gradle](gradle.md)、[Maven](maven.md)、[Ant](ant.md)、[Kobalt](https://beust.com/kobalt/home/index.html)があります。クライアントサイドJavaScriptをターゲットとするビルドツールもいくつかあります。

### Kotlinは何にコンパイルされますか？

JVMをターゲットとする場合、KotlinはJava互換のバイトコードを生成します。

JavaScriptをターゲットとする場合、KotlinはES5.1にトランスパイルされ、AMDやCommonJSなどのモジュールシステムと互換性のあるコードを生成します。

ネイティブをターゲットとする場合、Kotlinはプラットフォーム固有のコード（LLVM経由）を生成します。

### KotlinはどのJVMバージョンをターゲットにしていますか？

Kotlinでは、実行するJVMのバージョンを選択できます。デフォルトでは、Kotlin/JVMコンパイラはJava 8互換のバイトコードを生成します。
新しいバージョンのJavaで利用可能な最適化を利用したい場合は、ターゲットのJavaバージョンを9から23まで明示的に指定できます。この場合、生成されたバイトコードは下位バージョンでは実行できない可能性があることに注意してください。
[Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8)以降、コンパイラはJava 8未満のバージョンと互換性のあるバイトコードの生成をサポートしていません。

### Kotlinは難しいですか？

Kotlinは、Java、C#、JavaScript、Scala、Groovyなどの既存の言語に触発されています。Kotlinは習得しやすいように努めており、数日中にKotlinを読んだり書いたりできるよう、簡単に取り組めるようにしています。
イディオム的なKotlinを習得し、その高度な機能のいくつかを使用するにはもう少し時間がかかるかもしれませんが、全体として複雑な言語ではありません。
詳細については、[学習資料](learning-materials-overview.md)をご覧ください。

### どのような企業がKotlinを使用していますか？

Kotlinを使用している企業は多数ありすぎて列挙できませんが、ブログ記事、GitHubリポジトリ、講演などを通じてKotlinの使用を公に宣言しているより目立つ企業には、[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/)、[Corda](https://corda.net/blog/kotlin/)などがあります。

### 誰がKotlinを開発していますか？

Kotlinは、[JetBrainsのエンジニアチーム（現在のチーム規模は100名以上）](https://www.jetbrains.com/)によって開発されています。
主任言語デザイナーはMichail Zarečenskijです。コアチームに加えて、GitHubには250名以上の外部コントリビューターもいます。

### Kotlinについてどこでさらに学べますか？

始めるのに最適な場所は、[公式ウェブサイト](https://kotlinlang.org)です。
Kotlinを始めるには、[公式IDE](kotlin-ide.md)のいずれかをインストールするか、[オンラインで試す](https://play.kotlinlang.org)ことができます。

### Kotlinに関する書籍はありますか？

Kotlinに関する書籍が多数出版されています。その中には、弊社がレビューし、入門としてお勧めできるものもいくつかあります。それらは[書籍](books.md)ページに掲載されています。
さらに多くの書籍については、[kotlin.link](https://kotlin.link/)のコミュニティが管理するリストをご覧ください。

### Kotlinのオンラインコースはありますか？

JetBrains Academyの[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)で、動作するアプリケーションを作成しながらKotlinの基礎をすべて学ぶことができます。

受講できるその他のコースをいくつか紹介します。
* [Pluralsightコース: Getting Started with Kotlin](https://www.pluralsight.com/courses/kotlin-getting-started) by Kevin Jones
* [O'Reillyコース: Introduction to Kotlin Programming](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/) by Hadi Hariri
* [Udemyコース: 10 Kotlin Tutorials for Beginners](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/) by Peter Sommerhoff

また、[YouTubeチャンネル](https://www.youtube.com/c/Kotlin)で他のチュートリアルやコンテンツを確認することもできます。

### Kotlinにコミュニティはありますか？

はい！Kotlinには非常に活発なコミュニティがあります。Kotlin開発者は、[Kotlinフォーラム](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)、そしてより活発に[Kotlin Slack](https://slack.kotlinlang.org)（2020年4月時点で30000名近くのメンバー）で交流しています。

### Kotlinのイベントはありますか？

はい！現在、Kotlinに特化した多くのユーザーグループやミートアップがあります。[ウェブサイトにリスト](https://kotlinlang.org/user-groups/user-group-list.html)があります。
さらに、世界中でコミュニティが主催する[Kotlin Nights](https://kotlinlang.org/community/events.html)イベントも開催されています。

### Kotlinカンファレンスはありますか？

はい！[KotlinConf](https://kotlinconf.com/)は、JetBrainsが主催する年次カンファレンスで、世界中の開発者、愛好家、専門家が集まり、Kotlinに関する知識と経験を共有します。

テクニカルセッションやワークショップに加えて、KotlinConfではネットワーキングの機会、コミュニティとの交流、ソーシャルイベントも提供され、参加者は仲間のKotlinerとつながり、アイデアを交換できます。
これは、Kotlinエコシステム内でのコラボレーションとコミュニティ構築を促進するためのプラットフォームとして機能します。

Kotlinは、世界中のさまざまなカンファレンスでも取り上げられています。
[ウェブサイトで今後の講演のリスト](https://kotlinlang.org/community/talks.html?time=upcoming)を見つけることができます。

### Kotlinはソーシャルメディアを利用していますか？

はい。
[Kotlin YouTubeチャンネル](https://www.youtube.com/c/Kotlin)を購読し、Kotlinを[Twitter](https://twitter.com/kotlin)または[Bluesky](https://bsky.app/profile/kotlinlang.org)でフォローしてください。

### その他のオンラインKotlinリソースはありますか？

ウェブサイトには、コミュニティメンバーによる[Kotlin Digests](https://kotlin.link)、[ニュースレター](http://kotlinweekly.net)、[ポッドキャスト](https://talkingkotlin.com)など、多数の[オンラインリソース](https://kotlinlang.org/community/)があります。

### HD版のKotlinロゴはどこで入手できますか？

ロゴは[こちら](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)からダウンロードできます。
ロゴを使用する際は、アーカイブ内の`guidelines.pdf`と[Kotlinブランド使用ガイドライン](https://kotlinfoundation.org/guidelines/)に記載されている簡単なルールに従ってください。

詳細については、[Kotlinブランド資産](kotlin-brand-assets.md)のページをご覧ください。