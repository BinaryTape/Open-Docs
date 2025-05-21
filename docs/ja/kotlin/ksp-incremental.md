---
title: インクリメンタル処理
---
インクリメンタル処理は、ソースの再処理を可能な限り回避する処理技術です。
インクリメンタル処理の主な目標は、典型的な変更-コンパイル-テストサイクルにおけるターンアラウンドタイムを短縮することです。
一般的な情報については、Wikipediaの記事[incremental computing](https://en.wikipedia.org/wiki/Incremental_computing)を参照してください。

どのソースが_ダーティ_（再処理が必要）であるかを判断するために、KSP はどの入力ソースがどの生成された出力に対応するかを特定するために、プロセッサの支援を必要とします。
この、往々にして扱いにくくエラーが発生しやすいプロセスを支援するために、KSP はプロセッサがコード構造をナビゲートするための開始点として使用する、最小限の_ルートソース_のセットのみを必要とするように設計されています。
言い換えれば、プロセッサは対応する `KSNode` のソースと出力を関連付ける必要があります。`KSNode` が次のいずれかから取得された場合です。
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

インクリメンタル処理は現在、デフォルトで有効になっています。無効にするには、Gradle プロパティ `ksp.incremental=false` を設定します。
依存関係と出力に応じてダーティセットをダンプするログを有効にするには、`ksp.incremental.log=true` を使用します。
これらのログファイルは、`.log` ファイル拡張子を持つ `build` 出力ディレクトリにあります。

JVM では、クラスパスの変更、Kotlin および Java のソース変更がデフォルトで追跡されます。
Kotlin および Java のソース変更のみを追跡するには、Gradle プロパティ `ksp.incremental.intermodule=false` を設定して、クラスパスの追跡を無効にします。

## 集約と分離

[Gradle annotation processing](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)の概念と同様に、KSP は_集約_モードと_分離_モードの両方をサポートします。
Gradle annotation processing とは異なり、KSP は各出力をプロセッサ全体ではなく、集約または分離のいずれかとして分類することに注意してください。

集約出力は、他のファイルに影響を与えないファイルの削除を除き、入力の変更によって影響を受ける可能性があります。
これは、入力の変更によりすべての集約出力がリビルドされることを意味し、これは対応する登録済み、新規、および変更されたすべてのソースファイルの再処理を意味します。

例として、特定の注釈を持つすべてのシンボルを収集する出力は、集約出力と見なされます。

分離出力は、指定されたソースのみに依存します。他のソースへの変更は、分離出力には影響しません。
Gradle annotation processing とは異なり、特定の出力に対して複数のソースファイルを定義できることに注意してください。

例として、実装するインターフェース専用に生成されたクラスは、分離されていると見なされます。

要約すると、出力が新しいソースまたは変更されたソースに依存する可能性がある場合、それは集約と見なされます。
それ以外の場合、出力は分離されます。

Java annotation processing に精通している読者向けの概要を以下に示します。
* 分離 Java annotation processor では、すべての出力は KSP で分離されます。
* 集約 Java annotation processor では、一部の出力は KSP で分離でき、一部の出力は集約できます。

### 実装方法

依存関係は、アノテーションではなく、入力ファイルと出力ファイルの関連付けによって計算されます。
これは多対多の関係です。

入出力の関連付けによるダーティネスの伝播ルールは次のとおりです。
1. 入力ファイルが変更された場合、常に再処理されます。
2. 入力ファイルが変更され、出力に関連付けられている場合、同じ出力に関連付けられている他のすべての入力ファイルも再処理されます。
   これは推移的です。つまり、新しいダーティファイルがなくなるまで無効化が繰り返し行われます。
3. 1つ以上の集約出力に関連付けられているすべての入力ファイルが再処理されます。
   言い換えれば、入力ファイルが集約出力に関連付けられていない場合、再処理されません
   （上記の 1. または 2. に該当する場合を除く）。

理由は次のとおりです。
1. 入力が変更された場合、新しい情報が導入される可能性があるため、プロセッサは入力を使用して再度実行する必要があります。
2. 出力は入力のセットから作成されます。プロセッサは、出力を再生成するためにすべての入力を必要とする場合があります。
3. `aggregating=true` は、出力が新しい情報に依存する可能性があることを意味します。これは、新しいファイルまたは変更された既存のファイルから取得できます。
   `aggregating=false` は、プロセッサが情報が特定の入力ファイルからのみ取得され、他のファイルや新しいファイルからは決して取得されないことを確信していることを意味します。

## 例 1

プロセッサは、`A.kt` のクラス `A` と `B.kt` のクラス `B` を読み取った後、`outputForA` を生成します。ここで、`A` は `B` を拡張します。
プロセッサは `Resolver.getSymbolsWithAnnotation` で `A` を取得し、次に `KSClassDeclaration.superTypes` で `A` から `B` を取得しました。
`B` の包含は `A` によるものであるため、`outputForA` の `dependencies` で `B.kt` を指定する必要はありません。
この場合でも `B.kt` を指定できますが、不要です。

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt isn't required, because it can be deduced as a dependency by KSP
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA depends on A.kt and B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 例 2

プロセッサが `sourceA` を読み取った後に `outputA` を生成し、`sourceB` を読み取った後に `outputB` を生成することを検討してください。

`sourceA` が変更された場合：
* `outputB` が集約されている場合、`sourceA` と `sourceB` の両方が再処理されます。
* `outputB` が分離されている場合、`sourceA` のみが再処理されます。

`sourceC` が追加された場合：
* `outputB` が集約されている場合、`sourceC` と `sourceB` の両方が再処理されます。
* `outputB` が分離されている場合、`sourceC` のみが再処理されます。

`sourceA` が削除された場合、何も再処理する必要はありません。

`sourceB` が削除された場合、何も再処理する必要はありません。

## ファイルのダーティネスがどのように決定されるか

ダーティファイルは、ユーザーによって直接_変更_されるか、他のダーティファイルによって間接的に_影響_を受けます。
KSP は、ダーティネスを次の 2 つのステップで伝播します。
* _解決トレース_による伝播:
  型参照を（暗黙的または明示的に）解決することは、あるファイルから別のファイルにナビゲートする唯一の方法です。
  型参照がプロセッサによって解決されると、変更が含まれている変更または影響を受けたファイルは、その参照を含むファイルに影響を与えます。
* _入出力対応_による伝播:
  ソースファイルが変更または影響を受けた場合、そのファイルと一部の出力を共有する他のすべてのソースファイルが影響を受けます。

それらの両方が推移的であり、2番目の形式は同値類を形成することに注意してください。

## バグの報告

バグを報告するには、Gradle プロパティ `ksp.incremental=true` と `ksp.incremental.log=true` を設定し、クリーンビルドを実行してください。
このビルドでは、次の 2 つのログファイルが生成されます。

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

次に、連続するインクリメンタルビルドを実行すると、次の 2 つのログファイルが追加で生成されます。

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

これらのログには、ソースと出力のファイル名、およびビルドのタイムスタンプが含まれています。