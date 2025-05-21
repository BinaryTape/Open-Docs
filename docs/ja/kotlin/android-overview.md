---
title: "Kotlin for Android"
---
Androidモバイル開発は、2019年のGoogle I/O以来、[Kotlin-first](https://developer.android.com/kotlin/first)です。

プロのAndroid開発者の50%以上がKotlinを主要言語として使用しており、Javaをメイン言語として使用しているのはわずか30%です。Kotlinを主要言語とする開発者の70%が、Kotlinによって生産性が向上すると述べています。

Android開発にKotlinを使用すると、次の利点があります。

* **コード量が少なく、可読性が高い**。コードの作成や、他者のコードの理解にかかる時間を削減できます。
* **一般的なエラーが少ない**。[Googleの社内データ](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)によると、Kotlinで構築されたアプリはクラッシュする可能性が20%低くなります。
* **[Jetpack libraries](https://developer.android.com/jetpack/compose)でのKotlinサポート**。[Jetpack Compose](https://developer.android.com/jetpack/compose)は、KotlinでネイティブUIを構築するためのAndroid推奨の最新ツールキットです。[KTX extensions](https://developer.android.com/kotlin/ktx)は、コルーチン、拡張関数、ラムダ、名前付きパラメータなど、Kotlinの言語機能を既存のAndroidライブラリに追加します。
* **マルチプラットフォーム開発のサポート**。Kotlin Multiplatformを使用すると、Androidだけでなく、[iOS](https://kotlinlang.org/lp/multiplatform/)、バックエンド、およびWebアプリケーションの開発も可能です。[一部のJetpackライブラリ](https://developer.android.com/kotlin/multiplatform)はすでにマルチプラットフォーム対応です。KotlinとJetpack ComposeをベースにしたJetBrainsの宣言型UIフレームワークである[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)を使用すると、iOS、Android、デスクトップ、Webなどのプラットフォーム間でUIを共有できます。
* **成熟した言語と環境**。2011年の作成以来、Kotlinは言語としてだけでなく、堅牢なツールを備えたエコシステム全体として継続的に発展してきました。現在では、[Android Studio](https://developer.android.com/studio)にシームレスに統合されており、多くの企業がAndroidアプリケーションの開発に積極的に使用しています。
* **Javaとの相互運用性**。Kotlinを使用すると、すべてのコードをKotlinに移行する必要なく、Javaプログラミング言語と一緒にアプリケーションで使用できます。
* **簡単な学習**。Kotlinは、特にJava開発者にとって非常に簡単に学習できます。
* **大規模なコミュニティ**。Kotlinは、世界中で成長しているコミュニティからの優れたサポートと多くの貢献を得ています。上位1000のAndroidアプリの95%以上がKotlinを使用しています。

多くのスタートアップ企業やFortune 500企業がすでにKotlinを使用してAndroidアプリケーションを開発しています。リストは[Android開発者向けのGoogleウェブサイト](https://developer.android.com/kotlin/stories)に掲載されています。

Kotlinの使用を開始するには：

* Android開発の場合は、[KotlinでAndroidアプリを開発するためのGoogleのドキュメント](https://developer.android.com/kotlin/get-started)をお読みください。
* クロスプラットフォームのモバイルアプリケーションを開発する場合は、[共有ロジックとネイティブUIを備えたアプリの作成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)を参照してください。