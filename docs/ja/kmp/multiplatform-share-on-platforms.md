[//]: # (title: プラットフォーム間でのコード共有)

Kotlin Multiplatformを使用すると、Kotlinが提供するメカニズムを使用してコードを共有できます：

* [プロジェクトで使用されるすべてのプラットフォーム間でのコード共有](#share-code-on-all-platforms)。すべてのプラットフォームに適用される共通のビジネスロジックを共有するために使用します。
* [一部のプラットフォーム間でのコード共有](#share-code-on-similar-platforms)。プロジェクトに含まれる一部（すべてではない）のプラットフォーム間でコードを共有します。階層構造（hierarchical structure）を利用して、類似したプラットフォーム間でコードを再利用できます。

共有コードからプラットフォーム固有のAPIにアクセスする必要がある場合は、Kotlinの[期待宣言と実体宣言（expected and actual declarations）](multiplatform-expect-actual.md)のメカニズムを使用してください。

## すべてのプラットフォームでのコード共有

すべてのプラットフォームに共通するビジネスロジックがある場合、プラットフォームごとに同じコードを記述する必要はありません。共通ソースセット（common source set）で共有するだけです。

![すべてのプラットフォームで共有されるコード](flat-structure.svg)

ソースセットの一部の依存関係はデフォルトで設定されています。以下のものについては、手動で `dependsOn` 関係を指定する必要はありません：
* `jvmMain` や `macosX64Main` など、共通ソースセットに依存するすべてのプラットフォーム固有のソースセット。
* `androidMain` と `androidUnitTest` など、特定のターゲットの `main` ソースセットと `test` ソースセットの間。

共有コードからプラットフォーム固有のAPIにアクセスする必要がある場合は、Kotlinの[期待宣言と実体宣言（expected and actual declarations）](multiplatform-expect-actual.md)のメカニズムを使用してください。

## 類似したプラットフォームでのコード共有

多くの場合、共通のロジックやサードパーティAPIを大量に再利用できる可能性のある、複数のネイティブターゲットを作成する必要があります。

例えば、iOSをターゲットとする一般的なマルチプラットフォームプロジェクトでは、iOS ARM64デバイス用とx64シミュレータ用の2つのiOS関連ターゲットがあります。これらには個別のプラットフォーム固有ソースセットがありますが、実際にはデバイスとシミュレータで異なるコードが必要になることは稀であり、依存関係もほぼ同じです。そのため、iOS固有のコードをそれらの間で共有できます。

明らかに、この構成では、2つのiOSターゲットに対して共有ソースセットを用意し、iOSデバイスとシミュレータの両方に共通するAPIを直接呼び出せるKotlin/Nativeコードを記述できることが望ましいです。

この場合、以下のいずれかの方法で[階層構造](multiplatform-hierarchy.md)を使用して、プロジェクト内のネイティブターゲット間でコードを共有できます：

* [デフォルトの階層テンプレートの使用](multiplatform-hierarchy.md#default-hierarchy-template)
* [階層構造を手動で構成する](multiplatform-hierarchy.md#manual-configuration)

[ライブラリでのコード共有](#share-code-in-libraries)および[プラットフォーム固有ライブラリの接続](#connect-platform-specific-libraries)についての詳細をご覧ください。

## ライブラリでのコード共有

階層的なプロジェクト構造のおかげで、ライブラリもターゲットのサブセットに対して共通のAPIを提供できます。[ライブラリが公開](multiplatform-publish-lib-setup.md)されると、その中間ソースセットのAPIは、プロジェクト構造に関する情報とともにライブラリアーティファクトに埋め込まれます。このライブラリを使用すると、プロジェクトの中間ソースセットは、各ソースセットのターゲットが利用可能なライブラリのAPIにのみアクセスします。

例えば、`kotlinx.coroutines` リポジトリの以下のソースセット階層を確認してください：

![ライブラリの階層構造](lib-hierarchical-structure.svg)

`concurrent` ソースセットは `runBlocking` 関数を宣言し、JVMとネイティブターゲット向けにコンパイルされます。`kotlinx.coroutines` ライブラリが階層的なプロジェクト構造で更新および公開されると、ライブラリの `concurrent` ソースセットの「ターゲットシグネチャ」と一致するため、JVMとネイティブターゲット間で共有されているソースセットからそれに依存して `runBlocking` を呼び出すことができます。

## プラットフォーム固有ライブラリの接続

プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有するには、Foundation、UIKit、POSIXなどの[プラットフォームライブラリ](https://kotlinlang.org/docs/native-platform-libs.html)を使用します。これらのライブラリはKotlin/Nativeに同梱されており、デフォルトで共有ソースセットで利用可能です。

さらに、プロジェクトで [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) プラグインを使用している場合は、[`cinterop` メカニズム](https://kotlinlang.org/docs/native-c-interop.html)を使用して取り込まれたサードパーティのネイティブライブラリを扱うことができます。

## 次のステップ

* [Kotlinの期待宣言と実体宣言のメカニズムについて読む](multiplatform-expect-actual.md)
* [階層的なプロジェクト構造について詳しく学ぶ](multiplatform-hierarchy.md)
* [マルチプラットフォームライブラリの公開を設定する](multiplatform-publish-lib-setup.md)
* [マルチプラットフォームプロジェクトでのソースファイル命名に関する推奨事項を確認する](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)