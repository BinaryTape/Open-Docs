[//]: # (title: Android向けKotlin)

Androidモバイル開発は、2019年のGoogle I/O以来、[Kotlin-first](https://developer.android.com/kotlin/first)となっています。

プロのAndroid開発者の50%以上がKotlinを主要言語として使用しており、Javaを主要言語として使用しているのはわずか30%です。主要言語がKotlinである開発者の70%が、Kotlinによって生産性が向上すると述べています。

Android開発でKotlinを使用すると、以下の利点が得られます:

*   **少ないコード量と高い可読性**。コードを書く時間や、他人のコードを理解する作業にかかる時間を短縮できます。
*   **一般的なエラーの削減**。Kotlinで構築されたアプリは、[Googleの内部データ](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)によると、クラッシュする可能性が20%低くなります。
*   **JetpackライブラリでのKotlinサポート**。[Jetpack Compose](https://developer.android.com/jetpack/compose)は、AndroidがKotlinでネイティブUIを構築するために推奨する最新のツールキットです。[KTX extensions](https://developer.android.com/kotlin/ktx)は、コルーチン、拡張関数、ラムダ、名前付き引数など、Kotlin言語の機能を既存のAndroidライブラリに追加します。
*   **マルチプラットフォーム開発のサポート**。Kotlin Multiplatformは、Androidだけでなく、[iOS](https://kotlinlang.org/lp/multiplatform/)、バックエンド、Webアプリケーションの開発も可能にします。[一部のJetpackライブラリ](https://developer.android.com/kotlin/multiplatform)はすでにマルチプラットフォーム対応です。[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、JetBrainsが提供する、KotlinとJetpack Composeに基づく宣言型UIフレームワークであり、iOS、Android、デスクトップ、Webなど、複数のプラットフォーム間でUIを共有することを可能にします。
*   **成熟した言語と環境**。2011年の誕生以来、Kotlinは言語としてだけでなく、堅牢なツールを備えたエコシステム全体として継続的に発展してきました。現在では、[Android Studio](https://developer.android.com/studio)にシームレスに統合されており、多くの企業でAndroidアプリケーション開発に積極的に使用されています。
*   **Javaとの相互運用性**。すべてのコードをKotlinに移行する必要なく、KotlinはJavaプログラミング言語と組み合わせてアプリケーションで使用できます。
*   **習得の容易さ**。Kotlinは、特にJava開発者にとって非常に習得が容易です。
*   **大規模なコミュニティ**。Kotlinは、世界中で成長しているコミュニティからの強力なサポートと多くの貢献を得ています。上位1000のAndroidアプリのうち95%以上がKotlinを使用しています。

多くのスタートアップ企業やFortune 500企業がすでにKotlinを使用してAndroidアプリケーションを開発しています。そのリストは[Android開発者向けのGoogleウェブサイト](https://developer.android.com/kotlin/stories)で確認できます。

Kotlinの使用を開始するには:

*   Android開発の場合、[KotlinでAndroidアプリを開発するためのGoogleのドキュメント](https://developer.android.com/kotlin/get-started)を参照してください。
*   クロスプラットフォームモバイルアプリケーションを開発する場合、[共有ロジックとネイティブUIを持つアプリの作成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)を参照してください。