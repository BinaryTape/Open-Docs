[//]: # (title: プラットフォーム間でのコード共有)

Kotlin Multiplatform を使用すると、Kotlin が提供するメカニズムを利用してコードを共有できます。

*   [プロジェクトで使用するすべてのプラットフォームでコードを共有する](#share-code-on-all-platforms)。これは、すべてのプラットフォームに適用される共通のビジネスロジックを共有するために使用します。
*   [プロジェクトに含まれる一部のプラットフォーム（ただしすべてではない）でコードを共有する](#share-code-on-similar-platforms)。階層構造を利用することで、類似のプラットフォームでコードを再利用できます。

共有コードからプラットフォーム固有のAPIにアクセスする必要がある場合は、Kotlinの[期待される宣言と実際の宣言](multiplatform-expect-actual.md)メカニズムを使用します。

## すべてのプラットフォームでコードを共有する

すべてのプラットフォームで共通のビジネスロジックがある場合、各プラットフォームで同じコードを記述する必要はありません。共通ソースセットで共有するだけで済みます。

![すべてのプラットフォームで共有されるコード](flat-structure.svg)

ソースセットの一部の依存関係はデフォルトで設定されています。`dependsOn` 関係を手動で指定する必要はありません。
*   `jvmMain`、`macosX64Main` など、共通ソースセットに依存するすべてのプラットフォーム固有のソースセット。
*   `androidMain` と `androidUnitTest` のように、特定のターゲットの `main` ソースセットと `test` ソースセット間。

共有コードからプラットフォーム固有のAPIにアクセスする必要がある場合は、Kotlinの[期待される宣言と実際の宣言](multiplatform-expect-actual.md)メカニズムを使用します。

## 類似のプラットフォームでコードを共有する

多くの場合、共通のロジックやサードパーティAPIの多くを再利用できる複数のネイティブターゲットを作成する必要があります。

例えば、iOSをターゲットとする典型的なマルチプラットフォームプロジェクトでは、iOS関連のターゲットが2つあります。1つはiOS ARM64デバイス用、もう1つはx64シミュレーター用です。これらは個別のプラットフォーム固有のソースセットを持ちますが、実際にはデバイスとシミュレーターで異なるコードが必要となることは稀であり、それらの依存関係もほとんど同じです。したがって、iOS固有のコードはそれらの間で共有できます。

明らかに、このセットアップでは、2つのiOSターゲット間で共有ソースセットを持ち、iOSデバイスとシミュレーターの両方に共通するAPIをKotlin/Nativeコードが直接呼び出すことができることが望ましいでしょう。

この場合、以下のいずれかの方法で、[階層構造](multiplatform-hierarchy.md)を使用してプロジェクト内のネイティブターゲット間でコードを共有できます。

*   [デフォルトの階層テンプレートを使用する](multiplatform-hierarchy.md#default-hierarchy-template)
*   [階層構造を手動で構成する](multiplatform-hierarchy.md#manual-configuration)

[ライブラリでのコード共有](#share-code-in-libraries)と[プラットフォーム固有ライブラリの接続](#connect-platform-specific-libraries)について詳しく学びましょう。

## ライブラリでコードを共有する

階層的なプロジェクト構造のおかげで、ライブラリもターゲットのサブセットに対して共通APIを提供できます。[ライブラリが公開される](multiplatform-publish-lib-setup.md)と、その中間ソースセットのAPIは、プロジェクト構造に関する情報と共にライブラリ成果物に埋め込まれます。このライブラリを使用すると、プロジェクトの中間ソースセットは、各ソースセットのターゲットで利用可能なライブラリのAPIのみにアクセスできます。

例えば、`kotlinx.coroutines` リポジトリの以下のソースセット階層を確認してください。

![ライブラリの階層構造](lib-hierarchical-structure.svg)

`concurrent` ソースセットは関数 `runBlocking` を宣言し、JVMとネイティブターゲット向けにコンパイルされます。`kotlinx.coroutines` ライブラリが階層的なプロジェクト構造で更新および公開されると、それに依存し、ライブラリの `concurrent` ソースセットの「ターゲットシグネチャ」と一致するため、JVMとネイティブターゲット間で共有されるソースセットから `runBlocking` を呼び出すことができます。

## プラットフォーム固有ライブラリを接続する

プラットフォーム固有の依存関係に制約されることなく、より多くのネイティブコードを共有するには、Foundation、UIKit、POSIXなどの[プラットフォームライブラリ](https://kotlinlang.org/docs/native-platform-libs.html)を使用します。これらのライブラリはKotlin/Nativeに同梱されており、共有ソースセットでデフォルトで利用可能です。

さらに、プロジェクトで[Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md)プラグインを使用している場合、[`cinterop`メカニズム](https://kotlinlang.org/docs/native-c-interop.html)で利用されるサードパーティのネイティブライブラリを操作できます。

## 次のステップ

*   [Kotlinの期待される宣言と実際の宣言のメカニズムについて読む](multiplatform-expect-actual.md)
*   [階層的なプロジェクト構造について学ぶ](multiplatform-hierarchy.md)
*   [マルチプラットフォームライブラリの公開を設定する](multiplatform-publish-lib-setup.md)
*   [マルチプラットフォームプロジェクトでのソースファイル命名に関する推奨事項を見る](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)