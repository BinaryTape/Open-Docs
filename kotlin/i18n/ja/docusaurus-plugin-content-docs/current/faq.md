---
title: FAQ
description: "Kotlin は JetBrains が開発した簡潔なマルチプラットフォームプログラミング言語です。"
---
### Kotlinとは？

Kotlinは、JVM、Android、JavaScript、Wasm、そしてNativeをターゲットとした、オープンソースの静的型付けプログラミング言語です。
[JetBrains](https://www.jetbrains.com/)によって開発されています。プロジェクトは2010年に開始され、非常に早い段階からオープンソースでした。
最初の公式1.0リリースは2016年2月でした。

### Kotlinの現在のバージョンは何ですか？

現在リリースされているバージョンは2.1.20で、2025年3月20日に公開されました。
詳細については、[GitHub](https://github.com/jetbrains/kotlin)をご覧ください。

### Kotlinは無料ですか？

はい。Kotlinは無料で、これまでも無料であり、これからも無料です。Apache 2.0ライセンスの下で開発されており、ソースコードは
[GitHub](https://github.com/jetbrains/kotlin)で入手できます。

### Kotlinはオブジェクト指向言語ですか、それとも関数型言語ですか？

Kotlinにはオブジェクト指向と関数型の両方の構成要素があります。OOとFPの両方のスタイルで使用したり、2つの要素を組み合わせたりできます。
高階関数、関数型、ラムダなどの機能を第一級でサポートしているため、Kotlinは
関数型プログラミングを行ったり、探求したりする場合に最適な選択肢です。

### Javaプログラミング言語と比較して、Kotlinにはどのような利点がありますか？

Kotlinはより簡潔です。概算では、コード行数が約40％削減されることが示されています。
また、より型安全です。たとえば、null非許容型のサポートにより、アプリケーションがNPE（NullPointerException）を起こしにくくなります。
スマートキャスト、高階関数、拡張関数、レシーバー付きラムダなどのその他の機能により、表現力豊かなコードを記述できるだけでなく、DSLの作成も容易になります。

### KotlinはJavaプログラミング言語と互換性がありますか？

はい。KotlinはJavaプログラミング言語と100％相互運用可能であり、既存のコードベースがKotlinと適切に連携するように重点が置かれています。
[JavaからKotlinのコードを簡単に呼び出す](java-to-kotlin-interop)ことができ、[KotlinからJavaのコードを呼び出す](java-interop)こともできます。これにより、採用がはるかに簡単になり、リスクが軽減されます。
また、既存のコードの移行を簡素化する、自動化された[Java-to-KotlinコンバーターがIDEに組み込まれています](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)。

### Kotlinは何に使用できますか？

Kotlinは、サーバーサイド、クライアントサイドWeb、Android、またはマルチプラットフォームライブラリなど、あらゆる種類の開発に使用できます。
現在開発中のKotlin/Nativeでは、組み込みシステム、macOS、iOSなどの他のプラットフォームのサポートも予定されています。
人々はKotlinをモバイルおよびサーバーサイドアプリケーション、JavaScriptまたはJavaFXを使用したクライアントサイド、データサイエンスなどに使用しています。

### Android開発にKotlinを使用できますか？

はい。Kotlinは、Androidで第一級言語としてサポートされています。Basecamp、Pinterestなど、すでにKotlinをAndroidに使用しているアプリケーションが数百あります。詳細については、[Android開発に関するリソース](android-overview)をご覧ください。

### サーバーサイド開発にKotlinを使用できますか？

はい。KotlinはJVMと100％互換性があるため、Spring Boot、vert.x、JSFなどの既存のフレームワークを使用できます。さらに、[Ktor](https://github.com/kotlin/ktor)など、Kotlinで記述された特定のフレームワークもあります。詳細については、[サーバーサイド開発に関するリソース](server-overview)をご覧ください。

### Web開発にKotlinを使用できますか？

はい。バックエンドのWeb開発では、Kotlinは[Ktor](https://ktor.io/)や[Spring](https://spring.io/)などのフレームワークと連携して、サーバーサイドアプリケーションを効率的に構築できます。さらに、クライアントサイドのWeb開発にはKotlin/Wasmを使用できます。
[Kotlin/Wasmを始める方法](wasm-get-started)をご覧ください。

### デスクトップ開発にKotlinを使用できますか？

はい。JavaFx、SwingなどのJava UIフレームワークを使用できます。
さらに、[TornadoFX](https://github.com/edvin/tornadofx)などのKotlin固有のフレームワークもあります。

### ネイティブ開発にKotlinを使用できますか？

はい。Kotlin/Nativeは、Kotlinの一部として利用できます。KotlinをVMなしで実行できるネイティブコードにコンパイルします。
一般的なデスクトップおよびモバイルプラットフォーム、さらには一部のIoTデバイスで試すことができます。
詳細については、[Kotlin/Nativeのドキュメント](native-overview)をご覧ください。

### どのIDEがKotlinをサポートしていますか？

Kotlinは、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)および
[Android Studio](https://developer.android.com/kotlin/get-started)で、JetBrainsによって開発された公式のKotlinプラグインを使用して、すぐに使用できます。

他のIDEおよびコードエディターには、Kotlinコミュニティがサポートするプラグインのみがあります。

ブラウザでKotlinコードを記述、実行、共有するには、[Kotlin Playground](https://play.kotlinlang.org)を試すこともできます。

さらに、アプリケーションのコンパイルと実行を簡単にサポートする[コマンドラインコンパイラー](command-line)も利用できます。

### どのビルドツールがKotlinをサポートしていますか？

JVM側では、主なビルドツールには、[Gradle](gradle)、[Maven](maven)、
[Ant](ant)、および[Kobalt](https://beust.com/kobalt/home/index.html)があります。クライアントサイドのJavaScriptをターゲットとするビルドツールもいくつかあります。

### Kotlinは何にコンパイルされますか？

JVMをターゲットとする場合、KotlinはJava互換のバイトコードを生成します。

JavaScriptをターゲットとする場合、KotlinはES5.1にトランスパイルされ、
AMDやCommonJSなどのモジュールシステムと互換性のあるコードを生成します。

ネイティブをターゲットとする場合、Kotlinはプラットフォーム固有のコードを生成します（LLVM経由）。

### KotlinはどのバージョンのJVMをターゲットとしていますか？

Kotlinでは、実行するJVMのバージョンを選択できます。デフォルトでは、Kotlin/JVMコンパイラーはJava 8互換のバイトコードを生成します。
新しいバージョンのJavaで利用可能な最適化を利用する場合は、ターゲットのJavaバージョンを9から23まで明示的に指定できます。この場合、結果のバイトコードは下位バージョンでは実行されない可能性があることに注意してください。
[Kotlin 1.5](whatsnew15#new-default-jvm-target-1-8)以降、コンパイラーは8未満のJavaバージョンと互換性のあるバイトコードの生成をサポートしていません。

### Kotlinは難しいですか？

Kotlinは、Java、C#、JavaScript、Scala、Groovyなどの既存の言語に触発されています。Kotlinが学習しやすいように努めてきたため、人々は数日で簡単にKotlinを読み書きできるようになります。
イディオム的なKotlinを学習し、より高度な機能を使用するにはもう少し時間がかかる場合がありますが、全体として複雑な言語ではありません。
詳細については、[学習教材](learning-materials-overview)をご覧ください。

### どの企業がKotlinを使用していますか？

Kotlinを使用している企業は多すぎてリストできませんが、ブログ投稿、GitHubリポジトリ、または講演を通じて、Kotlinの使用を公に宣言している企業には、
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、
[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/)、および[Corda](https://corda.net/blog/kotlin/)などがあります。

### 誰がKotlinを開発していますか？

Kotlinは、[JetBrainsのエンジニアチーム（現在のチーム規模は100人以上）](https://www.jetbrains.com/)によって開発されています。
リード言語デザイナーはMichail Zarečenskijです。コアチームに加えて、GitHubには250人以上の外部コントリビューターがいます。

### Kotlinについて詳しく知るにはどこに行けばよいですか？

最初に始めるのに最適な場所は[当社のウェブサイト](https://kotlinlang.org)です。
Kotlinを始めるには、[公式IDE](kotlin-ide)のいずれかをインストールするか、[オンラインで試す](https://play.kotlinlang.org)ことができます。

### Kotlinに関する書籍はありますか？

Kotlinで利用できる書籍は多数あります。そのうちのいくつかをレビューしており、始めるにあたって推奨できます。それらは[書籍](books)ページにリストされています。その他の書籍については、コミュニティが管理するリスト[kotlin.link](https://kotlin.link/)をご覧ください。

### Kotlinのオンラインコースはありますか？

JetBrains Academyの[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)を使用すると、実際に動作するアプリケーションを作成しながら、Kotlinの必需品をすべて学ぶことができます。

受講できるその他のコースをいくつか紹介します。
* [Pluralsightコース：Kotlin入門](https://www.pluralsight.com/courses/kotlin-getting-started)（Kevin Jones著）
* [O'Reillyコース：Kotlinプログラミング入門](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)（Hadi Hariri著）
* [Udemyコース：初心者のための10個のKotlinチュートリアル](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)（Peter Sommerhoff著）

[YouTubeチャンネル](https://www.youtube.com/c/Kotlin)でその他のチュートリアルやコンテンツを確認することもできます。

### Kotlinにはコミュニティがありますか？

はい！Kotlinには非常に活気のあるコミュニティがあります。Kotlin開発者は、[Kotlinフォーラム](https://discuss.kotlinlang.org)、
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)、および[Kotlin Slack](https://slack.kotlinlang.org)でより積極的に活動しています
（2020年4月時点で約30000人のメンバーがいます）。

### Kotlinイベントはありますか？

はい！現在、Kotlinを中心に活動する多くのユーザーグループとミートアップがあります。[ウェブサイトでリストを見つけることができます](https://kotlinlang.org/user-groups/user-group-list.html)。
さらに、コミュニティが主催する[Kotlin Nights](https://kotlinlang.org/community/events.html)イベントが世界中で開催されています。

### Kotlinのカンファレンスはありますか？

はい！[KotlinConf](https://kotlinconf.com/)はJetBrainsが主催する年次カンファレンスで、世界中の開発者、愛好家、
専門家が集まり、Kotlinに関する知識と経験を共有します。

技術的な講演やワークショップに加えて、KotlinConfはネットワーキングの機会、コミュニティとの交流、
参加者が仲間のKotlinerとつながり、アイデアを交換できるソーシャルイベントも提供します。
これは、Kotlinエコシステム内でのコラボレーションとコミュニティ構築を促進するためのプラットフォームとして機能します。

Kotlinは世界中のさまざまなカンファレンスでも取り上げられています。
[今後の講演のリストはウェブサイトにあります](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlinはソーシャルメディアにありますか？

はい。
[Kotlin YouTubeチャンネル](https://www.youtube.com/c/Kotlin)を購読し、Kotlinを[Twitter](https://twitter.com/kotlin)または[Bluesky](https://bsky.app/profile/kotlinlang.org)でフォローしてください。

### 他にKotlinのオンラインリソースはありますか？

ウェブサイトには、コミュニティメンバーによる[Kotlin Digests](https://kotlin.link)、
[ニュースレター](http://kotlinweekly.net)、[ポッドキャスト](https://talkingkotlin.com)など、多数の[オンラインリソース](https://kotlinlang.org/community/)があります。

### HD Kotlinロゴはどこで入手できますか？

ロゴは[こちら](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)からダウンロードできます。
ロゴを使用する場合は、アーカイブ内の`guidelines.pdf`と[Kotlinブランド使用ガイドライン](https://kotlinfoundation.org/guidelines/)の簡単なルールに従ってください。

詳細については、[Kotlinブランドアセット](kotlin-brand-assets)に関するページをご覧ください。