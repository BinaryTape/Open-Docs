---
title: プラットフォーム上でコードを共有する
---
Kotlin Multiplatform を使用すると、Kotlin が提供するメカニズムを使用してコードを共有できます。
 
* [プロジェクトで使用されているすべてのプラットフォーム間でコードを共有する](#share-code-on-all-platforms)。すべてのプラットフォームに適用される共通のビジネスロジックを共有するために使用します。
* プロジェクトに含まれているが、すべてではない[一部のプラットフォーム間でコードを共有する](#share-code-on-similar-platforms)。階層構造を利用して、類似したプラットフォームでコードを再利用できます。

共有コードからプラットフォーム固有の API にアクセスする必要がある場合は、Kotlin の [expected と actual の宣言](multiplatform-expect-actual)のメカニズムを使用します。

## すべてのプラットフォームでコードを共有する

すべてのプラットフォームに共通のビジネスロジックがある場合、プラットフォームごとに同じコードを作成する必要はありません。共通のソースセットで共有するだけです。

<img src="/img/flat-structure.svg" alt="Code shared for all platforms" style={{verticalAlign: 'middle'}}/>

ソースセットの一部の依存関係はデフォルトで設定されています。`dependsOn` 関係を手動で指定する必要はありません。
* `jvmMain`、`macosX64Main` など、共通のソースセットに依存するすべてのプラットフォーム固有のソースセットの場合。
* `androidMain` や `androidUnitTest` など、特定のターゲットの `main` と `test` のソースセット間の場合。

共有コードからプラットフォーム固有の API にアクセスする必要がある場合は、Kotlin の [expected と actual の宣言](multiplatform-expect-actual)のメカニズムを使用します。

## 類似したプラットフォームでコードを共有する

多くの場合、共通のロジックとサードパーティ API を再利用できる可能性のある複数のネイティブターゲットを作成する必要があります。

たとえば、iOS をターゲットとする典型的なマルチプラットフォームプロジェクトでは、iOS 関連のターゲットが 2 つあります。1 つは iOS ARM64 デバイス用、もう 1 つは x64 シミュレーター用です。これらには個別のプラットフォーム固有のソースセットがありますが、実際にはデバイスとシミュレーターで異なるコードが必要になることはほとんどなく、依存関係もほとんど同じです。そのため、iOS 固有のコードはそれらの間で共有できます。

明らかに、このセットアップでは、2 つの iOS ターゲットに対して共有ソースセットを用意し、iOS デバイスとシミュレーターの両方に共通の API を直接呼び出すことができる Kotlin/Native コードを使用できることが望ましいでしょう。

この場合、[階層構造](multiplatform-hierarchy)を使用して、プロジェクト内のネイティブターゲット間でコードを共有できます。
次のいずれかの方法を使用します。

* [デフォルトの階層テンプレートを使用する](multiplatform-hierarchy#default-hierarchy-template)
* [階層構造を手動で構成する](multiplatform-hierarchy#manual-configuration)

[ライブラリでのコード共有](#share-code-in-libraries)と[プラットフォーム固有のライブラリの接続](#connect-platform-specific-libraries)について詳しく学んでください。

## ライブラリでコードを共有する

階層的なプロジェクト構造のおかげで、ライブラリはターゲットのサブセットに対して共通の API を提供することもできます。[ライブラリが公開される](multiplatform-publish-lib)と、中間ソースセットの API は、プロジェクト構造に関する情報とともにライブラリのアーティファクトに埋め込まれます。このライブラリを使用すると、プロジェクトの中間ソースセットは、各ソースセットのターゲットで使用できるライブラリの API のみにアクセスします。

たとえば、`kotlinx.coroutines` リポジトリの次のソースセット階層を確認してください。

<img src="/img/lib-hierarchical-structure.svg" alt="Library hierarchical structure" style={{verticalAlign: 'middle'}}/>

`concurrent` ソースセットは関数 runBlocking を宣言し、JVM およびネイティブターゲット用にコンパイルされます。階層的なプロジェクト構造で `kotlinx.coroutines` ライブラリが更新および公開されると、それに依存し、JVM とネイティブターゲット間で共有されるソースセットから `runBlocking` を呼び出すことができます。これは、ライブラリの `concurrent` ソースセットの「ターゲットシグネチャ」と一致するためです。

## プラットフォーム固有のライブラリを接続する

プラットフォーム固有の依存関係によって制限されることなく、より多くのネイティブコードを共有するには、[プラットフォームライブラリ](native-platform-libs)（Foundation、UIKit、POSIX など）を使用します。これらのライブラリは Kotlin/Native と 함께 제공되며、デフォルトで共有ソースセットで使用できます。

また、プロジェクトで [Kotlin CocoaPods Gradle](native-cocoapods) プラグインを使用している場合は、[`cinterop` メカニズム](native-c-interop) で使用されるサードパーティのネイティブライブラリを使用できます。

## 次は何ですか？

* [Kotlin の expected と actual の宣言のメカニズムについて読む](multiplatform-expect-actual)
* [階層的なプロジェクト構造について詳しく学ぶ](multiplatform-hierarchy)
* [マルチプラットフォームライブラリの公開を設定する](multiplatform-publish-lib)
* [マルチプラットフォームプロジェクトでのソースファイルの名前付けに関する推奨事項を参照する](coding-conventions#source-file-names)