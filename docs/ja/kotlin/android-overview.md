[//]: # (title: Android向けKotlin)

Androidモバイル開発は、2019年のGoogle I/O以来、[Kotlinファースト](https://developer.android.com/kotlin/first)となっています。

プロのAndroid開発者の50%以上がKotlinを主要言語として使用しており、Javaを主要言語として使用しているのはわずか30%です。Kotlinを主要言語とする開発者の70%が、Kotlinによって生産性が向上したと答えています。

Android開発にKotlinを使用すると、以下のメリットが得られます。

*   **コード量の削減と可読性の向上**。コードを書く時間を短縮し、他の人のコードを理解する労力を減らすことができます。
*   **一般的なエラーの減少**。[Googleの内部データ](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)に基づくと、Kotlinで構築されたアプリはクラッシュする可能性が20%低くなります。
*   **JetpackライブラリでのKotlinサポート**。[Jetpack Compose](https://developer.android.com/jetpack/compose)は、Androidが推奨するKotlinでネイティブUIを構築するための最新のツールキットです。[KTX拡張機能](https://developer.android.com/kotlin/ktx)は、コルーチン、拡張関数、ラムダ、名前付き引数といったKotlin言語機能を既存のAndroidライブラリに追加します。
*   **マルチプラットフォーム開発のサポート**。Kotlin Multiplatformは、Androidだけでなく、[iOS](https://kotlinlang.org/lp/multiplatform/)、バックエンド、Webアプリケーションの開発も可能にします。[一部のJetpackライブラリ](https://developer.android.com/kotlin/multiplatform)は既にマルチプラットフォームに対応しています。[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、KotlinとJetpack Composeに基づいたJetBrainsの宣言型UIフレームワークで、iOS、Android、デスクトップ、Webといったプラットフォーム間でUIを共有することを可能にします。
*   **成熟した言語と環境**。2011年の誕生以来、Kotlinは言語としてだけでなく、強力なツールを備えたエコシステム全体として継続的に発展してきました。現在では[Android Studio](https://developer.android.com/studio)にシームレスに統合されており、多くの企業でAndroidアプリケーションの開発に積極的に使用されています。
*   **Javaとの相互運用性**。すべてのコードをKotlinに移行することなく、アプリケーションでKotlinとJavaプログラミング言語を併用できます。
*   **学習のしやすさ**。Kotlinは、特にJava開発者にとって、非常に習得しやすい言語です。
*   **活発なコミュニティ**。Kotlinには、世界中で成長しているコミュニティからの素晴らしいサポートと多くの貢献があります。上位1000のAndroidアプリの95%以上がKotlinを使用しています。

多くのスタートアップ企業やFortune 500企業が既にKotlinを使用してAndroidアプリケーションを開発しています。詳細なリストは[Android開発者向けのGoogleウェブサイト](https://developer.android.com/kotlin/stories)をご覧ください。

Kotlinの使用を開始するには：

*   Android開発の場合、[Googleのドキュメント（KotlinでAndroidアプリを開発する）](https://developer.android.com/kotlin/get-started)をお読みください。
*   クロスプラットフォームモバイルアプリケーションを開発する場合、[共有ロジックとネイティブUIを持つアプリを作成する](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)をご覧ください。