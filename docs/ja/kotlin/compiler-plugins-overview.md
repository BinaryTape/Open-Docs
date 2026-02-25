[//]: # (title: コンパイラプラグイン)

<snippet id="compiler-plugin-description">
コンパイラプラグインは、コンパイラ自体を修正することなく、コンパイル中のコードを分析または変更するためにコンパイルプロセスにフックします。例えば、コードにアノテーションを付加したり、他のフレームワークやAPIとの互換性を持たせるために新しいコードを生成したりできます。
</snippet>

このページでは、利用可能なKotlinコンパイラプラグインと、ユースケースに適したプラグインがない場合の対処法について説明します。

Kotlinチームは、以下のコンパイラプラグインをメンテナンスしています。

| プラグイン | 説明 |
|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| [All-open](all-open-plugin.md) | アノテーションが付加されたクラスとそのメンバを自動的に `open` にし、フレームワークが実行時にそれらを拡張できるようにします。 |
| [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu) | アトミック操作を、ロックフリーな並行処理のための効率的なプラットフォーム固有の実装に変換します。 |
| [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html) | [`DataFrame`](https://kotlin.github.io/dataframe/home.html) を安全かつKotlinフレンドリーな方法で扱うための、型付けされたAPIを生成します。 |
| [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen) | アプリケーションバイナリインターフェース (ABI) のJARファイルを生成します。 |
| [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) | KotlinクラスをプレーンなJavaScriptオブジェクトとして公開し、JSのツールやライブラリとの相互運用性を向上させます。 |
| [kapt](kapt.md) | Kotlinコード上でJavaのアノテーションプロセッサを実行し、追加のソースファイルを生成します。 |
| [Lombok](lombok.md) | Kotlinコードが、Javaソース内のLombokアノテーションによって生成されたコードを理解し、利用できるようにします。 |
| [`no-arg`](no-arg-plugin.md) | アノテーションが付加されたクラスに対して引数なしのコンストラクタを生成し、それを必要とするフレームワークをサポートします。 |
| [Power-assert](power-assert.md) | 式の各部分の値を詳細に表示することで、アサーション失敗時の情報を強化します。 |
| [SAM with receiver](sam-with-receiver-plugin.md) | SAMインターフェースがレシーバ付きラムダを使用できるようにし、よりDSLらしい構文を可能にします。 |
| [Serialization](serialization.md) | リフレクションを使用せずにKotlinオブジェクトをシリアライズおよびデシリアライズするコードを生成します。 |

GoogleのAndroidチームは以下をメンテナンスしています。

| プラグイン | 説明 |
|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler) | ComposeコンパイラをGradleと統合し、宣言型UI機能とCompose固有の最適化を有効にします。 |
| [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) | `Parcelable` 実装を自動的に生成し、Androidコンポーネント間でKotlinオブジェクトを受け渡しできるようにします。 |

これらのプラグインではカバーできない方法でコンパイルプロセスを調整する必要がある場合は、まず [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) や [Android lint](https://developer.android.com/studio/write/lint) などの外部リンターを使用できるかどうかを確認してください。
[Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler) を閲覧したり、[問い合わせ](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を行って、ユースケースに関するアドバイスを求めることもできます。

それでも必要なものが見つからない場合は、[カスタムコンパイラプラグインを作成](custom-compiler-plugins.md)することができます。KotlinコンパイラプラグインAPIは**不安定 (unstable)**であるため、この手法は最終手段としてのみ使用してください。カスタムコンパイラプラグインを作成する場合、コンパイラの新しいリリースごとに破壊的変更が導入されるため、メンテナンスに継続的かつ多大な労力を投じる必要があります。