[//]: # (title: プラットフォーム間でのコード共有)

Kotlin Multiplatform を使用すると、Kotlin が提供するメカニズムを使ってコードを共有できます。

*   プロジェクトで使用する**すべてのプラットフォーム間でコードを共有**します。すべてのプラットフォームに適用される共通のビジネスロジックを共有する場合に使用します。
*   プロジェクトに含まれる**一部のプラットフォーム間でコードを共有**しますが、すべてではありません。階層構造を利用して、類似したプラットフォームでコードを再利用できます。

共有コードからプラットフォーム固有の API にアクセスする必要がある場合は、Kotlin の[期待される宣言と実際の宣言 (expected and actual declarations)](multiplatform-expect-actual.md) のメカニズムを使用します。

## すべてのプラットフォームでコードを共有する

すべてのプラットフォームに共通のビジネスロジックがある場合、各プラットフォームで同じコードを記述する必要はありません。共通ソースセットで共有するだけです。

![すべてのプラットフォームで共有されるコード](flat-structure.svg)

一部のソースセットの依存関係はデフォルトで設定されます。`dependsOn` 関係を手動で指定する必要はありません。
*   `jvmMain` や `macosX64Main` など、共通ソースセットに依存するすべてのプラットフォーム固有のソースセットに対して。
*   `androidMain` と `androidUnitTest` など、特定のターゲットの `main` と `test` ソースセット間に対して。

共有コードからプラットフォーム固有の API にアクセスする必要がある場合は、Kotlin の[期待される宣言と実際の宣言](multiplatform-expect-actual.md)のメカニズムを使用します。

## 類似したプラットフォームでコードを共有する

共通のロジックやサードパーティ製 API の多くを再利用できる可能性がある、複数のネイティブターゲットを作成する必要があることがよくあります。

たとえば、iOS をターゲットとする一般的なマルチプラットフォームプロジェクトには、2つの iOS 関連ターゲットがあります。1つは iOS ARM64 デバイス用、もう1つは x64 シミュレーター用です。これらは個別のプラットフォーム固有のソースセットを持っていますが、実際にはデバイスとシミュレーターで異なるコードが必要となることはほとんどなく、その依存関係もほぼ同じです。そのため、iOS 固有のコードは両者間で共有できます。

この設定では、2つの iOS ターゲット用の共有ソースセットを持ち、iOS デバイスとシミュレーターの両方に共通する任意の API を Kotlin/Native コードから直接呼び出せるようにすることが望ましいのは明らかです。

この場合、以下のいずれかの方法で[階層構造 (hierarchical structure)](multiplatform-hierarchy.md) を使用して、プロジェクトのネイティブターゲット間でコードを共有できます。

*   [デフォルトの階層テンプレートを使用する](multiplatform-hierarchy.md#default-hierarchy-template)
*   [階層構造を手動で構成する](multiplatform-hierarchy.md#manual-configuration)

[ライブラリでのコード共有](#share-code-in-libraries) と [プラットフォーム固有のライブラリの接続](#connect-platform-specific-libraries) について詳しく学びましょう。

## ライブラリでコードを共有する

階層的なプロジェクト構造のおかげで、ライブラリはターゲットのサブセットに対して共通の API を提供することもできます。[ライブラリが公開される](multiplatform-publish-lib-setup.md) と、その中間ソースセットの API がプロジェクト構造に関する情報とともにライブラリアーティファクトに組み込まれます。このライブラリを使用すると、プロジェクトの中間ソースセットは、各ソースセットのターゲットで利用可能なライブラリの API のみにアクセスできます。

たとえば、`kotlinx.coroutines` リポジトリの以下のソースセット階層を確認してください。

![ライブラリの階層構造](lib-hierarchical-structure.svg)

`concurrent` ソースセットは `runBlocking` 関数を宣言し、JVM およびネイティブターゲット用にコンパイルされます。`kotlinx.coroutines` ライブラリが更新され、階層的なプロジェクト構造で公開されると、そのライブラリに依存し、ライブラリの `concurrent` ソースセットの「ターゲットシグネチャ」と一致するため、JVM とネイティブターゲット間で共有されるソースセットから `runBlocking` を呼び出すことができます。

## プラットフォーム固有のライブラリを接続する

プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有するには、Foundation、UIKit、POSIX などの[プラットフォームライブラリ](https://kotlinlang.org/docs/native-platform-libs.html)を使用します。これらのライブラリは Kotlin/Native に同梱されており、共有ソースセットでデフォルトで利用可能です。

さらに、プロジェクトで [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) プラグインを使用している場合、[`cinterop` メカニズム](https://kotlinlang.org/docs/native-c-interop.html) を介して使用されるサードパーティのネイティブライブラリを扱うことができます。

## 次のステップ

*   [Kotlin の期待される宣言と実際の宣言のメカニズムについて読む](multiplatform-expect-actual.md)
*   [階層的なプロジェクト構造について詳しく学ぶ](multiplatform-hierarchy.md)
*   [マルチプラットフォームライブラリの公開を設定する](multiplatform-publish-lib-setup.md)
*   [マルチプラットフォームプロジェクトにおけるソースファイル名の命名に関する推奨事項を見る](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)