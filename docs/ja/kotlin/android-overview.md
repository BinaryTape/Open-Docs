[//]: # (title: Android 開発における Kotlin)

2019 年の Google I/O 以降、Android モバイル開発は [Kotlin-first](https://developer.android.com/kotlin/first)（Kotlin ファースト）となっています。

プロの Android 開発者の 50% 以上が主要な言語として Kotlin を使用しており、Java をメイン言語として使用しているのはわずか 30% です。また、主要言語が Kotlin である開発者の 70% が、Kotlin によって生産性が向上したと述べています。

Android 開発に Kotlin を使用することで、以下のメリットが得られます：

* **コードの削減と可読性の向上**。コードを書く時間や、他人のコードを理解するために費やす時間を短縮できます。
* **一般的なエラーの減少**。[Google の内部データ](https://medium.com/androiddevelopers/fewer-crashes-and-more-stability-with-kotlin-b606c6a6ac04)によると、Kotlin で構築されたアプリはクラッシュする可能性が 20% 低くなります。
* **Jetpack ライブラリにおける Kotlin サポート**。[Jetpack Compose](https://developer.android.com/jetpack/compose) は、Kotlin でネイティブ UI を構築するための、Android 推奨のモダンなツールキットです。[KTX 拡張機能](https://developer.android.com/kotlin/ktx)は、コルーチン、拡張関数、ラムダ、名前付き引数などの Kotlin 言語機能を、既存の Android ライブラリに追加します。
* **マルチプラットフォーム開発のサポート**。Kotlin Multiplatform により、Android だけでなく [iOS](https://kotlinlang.org/multiplatform/)、バックエンド、Web アプリケーションの開発も可能になります。[一部の Jetpack ライブラリ](https://developer.android.com/kotlin/multiplatform)は、すでにマルチプラットフォームに対応しています。Kotlin と Jetpack Compose をベースにした JetBrains の宣言型 UI フレームワークである [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) を使用すると、iOS、Android、デスクトップ、Web の間で UI を共有できるようになります。
* **成熟した言語と環境**。2011 年の誕生以来、Kotlin は言語としてだけでなく、堅牢なツールを備えたエコシステム全体として継続的に発展してきました。現在では [Android Studio](https://developer.android.com/studio) にシームレスに統合されており、多くの企業で Android アプリケーションの開発に積極的に利用されています。
* **Java との相互運用性**。すべてのコードを Kotlin に移行しなくても、アプリケーション内で Java プログラミング言語と一緒に Kotlin を使用できます。
* **学習の容易さ**。Kotlin は非常に習得しやすく、特に Java 開発者にとっては容易です。
* **大きなコミュニティ**。Kotlin は世界中で成長を続けているコミュニティから多大なサポートと貢献を受けています。上位 1,000 個の Android アプリの 95% 以上で Kotlin が使用されています。

多くのスタートアップや Fortune 500 企業が、すでに Kotlin を使用して Android アプリケーションを開発しています。リストについては、[Android デベロッパー向けの Google ウェブサイト](https://developer.android.com/kotlin/stories)をご覧ください。

Kotlin の使用を開始するには：

* Android 開発については、[Kotlin を使用した Android アプリ開発に関する Google のドキュメント](https://developer.android.com/kotlin/get-started)をお読みください。
* クロスプラットフォームのモバイルアプリケーション開発については、[共有ロジックとネイティブ UI を備えたアプリの作成](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)をご覧ください。