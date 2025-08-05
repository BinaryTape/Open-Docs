[//]: # (title: インクリメンタル処理)

インクリメンタル処理は、可能な限りソースの再処理を避ける処理手法です。
インクリメンタル処理の主な目的は、典型的な変更・コンパイル・テストのサイクルのターンアラウンドタイムを短縮することです。
一般的な情報については、Wikipediaの[インクリメンタル・コンピューティング](https://en.wikipedia.org/wiki/Incremental_computing)に関する記事を参照してください。

どのソースが _ダーティ_ (再処理が必要なもの) であるかを判断するため、KSPはプロセッサーの助けを借りて、どの入力ソースがどの生成された出力に対応するかを特定する必要があります。しばしば煩雑でエラーが発生しやすいこのプロセスを助けるため、KSPはプロセッサーがコード構造をナビゲートするための開始点として使用する、最小限の _ルートソース_ のみを必要とするように設計されています。言い換えれば、`KSNode` が以下のいずれかから取得された場合、プロセッサーは出力を対応する `KSNode` のソースと関連付ける必要があります。
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

インクリメンタル処理は現在、デフォルトで有効になっています。無効にするには、Gradleプロパティ `ksp.incremental=false` を設定します。
依存関係と出力に基づいてダーティセットをダンプするログを有効にするには、`ksp.incremental.log=true` を使用します。
これらのログファイルは、`build` 出力ディレクトリに `.log` 拡張子で格納されています。

JVM上では、クラスパスの変更、およびKotlinとJavaのソース変更は、デフォルトで追跡されます。
KotlinとJavaのソース変更のみを追跡するには、`ksp.incremental.intermodule=false` Gradleプロパティを設定してクラスパスの追跡を無効にします。

## アグリゲーティングとアイソレーティング

[Gradleアノテーション処理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)の概念と同様に、KSPは _アグリゲーティング_ モードと _アイソレーティング_ モードの両方をサポートしています。Gradleアノテーション処理とは異なり、KSPはプロセッサー全体ではなく、各出力をアグリゲーティングまたはアイソレーティングのいずれかに分類する点に注意してください。

アグリゲーティング出力は、他のファイルに影響を与えないファイルの削除を除く、あらゆる入力変更の影響を潜在的に受ける可能性があります。これは、入力の変更によってすべてのアグリゲーティング出力が再ビルドされることを意味し、ひいては、対応するすべての登録済み、新規、および変更されたソースファイルの再処理を意味します。

例として、特定の`アノテーション`を持つすべての`シンボル`を収集する出力は、`アグリゲーティング出力`と見なされます。

アイソレーティング出力は、指定されたソースのみに依存します。他のソースへの変更は、アイソレーティング出力に影響を与えません。
Gradleアノテーション処理とは異なり、指定された出力に対して複数のソースファイルを定義できる点に注意してください。

例として、実装するインターフェース専用に生成されたクラスは、アイソレーティングと見なされます。

要約すると、出力が新規または変更されたソースに依存する可能性がある場合、それはアグリゲーティングと見なされます。
そうでない場合、出力はアイソレーティングです。

Javaアノテーション処理に精通している読者向けのまとめです:
* アイソレーティングなJavaアノテーションプロセッサーでは、すべての出力がKSPではアイソレーティングです。
* アグリゲーティングなJavaアノテーションプロセッサーでは、KSPでは一部の出力がアイソレーティング、一部がアグリゲーティングになりえます。

### 実装方法

依存関係は、アノテーションではなく、入力ファイルと出力ファイルの関連付けによって計算されます。
これは多対多の関係です。

入出力の関連付けによるダーティネス伝播ルールは次のとおりです:
1.  入力ファイルが変更された場合、それは常に再処理されます。
2.  入力ファイルが変更され、それが特定の出力に関連付けられている場合、同じ出力に関連付けられている他のすべての入力ファイルも再処理されます。これは推移的であり、新しいダーティファイルがなくなるまで無効化が繰り返し発生します。
3.  1つ以上のアグリゲーティング出力に関連付けられているすべての入力ファイルは再処理されます。
    言い換えれば、入力ファイルがいずれのアグリゲーティング出力にも関連付けられていない場合、それは再処理されません（上記の1.または2.に該当する場合を除く）。

理由は次のとおりです:
1.  入力が変更された場合、新しい情報が導入される可能性があるため、プロセッサーはその入力で再度実行する必要があります。
2.  出力は一連の入力から生成されます。プロセッサーは出力を再生成するためにすべての入力を必要とする場合があります。
3.  `aggregating=true` は、出力が新しい情報（新規ファイルまたは変更された既存ファイルから来る可能性がある）に潜在的に依存する可能性があることを意味します。
4.  `aggregating=false` は、プロセッサーが情報が特定の入力ファイルからのみ来るものであり、他のファイルや新規ファイルからは決して来ないことを確信していることを意味します。

## 例1

プロセッサーは、`A.kt`のクラス`A`と`B.kt`のクラス`B`を読み取った後、`outputForA`を生成します。ここで、`A`は`B`を継承しています。
プロセッサーは`Resolver.getSymbolsWithAnnotation`で`A`を取得し、その後`A`から`KSClassDeclaration.superTypes`で`B`を取得しました。
`B`の包含は`A`によるものであるため、`outputForA`の`dependencies`に`B.kt`を指定する必要はありません。
この場合でも`B.kt`を指定することは可能ですが、それは不要です。

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
        // B.kt はKSPによって依存関係として推論できるため、必要ありません。
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA は A.kt と B.kt に依存します。
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 例2

プロセッサーが`sourceA`を読み取った後に`outputA`を生成し、`sourceB`を読み取った後に`outputB`を生成すると考えます。

`sourceA`が変更された場合:
* `outputB`がアグリゲーティングの場合、`sourceA`と`sourceB`の両方が再処理されます。
* `outputB`がアイソレーティングの場合、`sourceA`のみが再処理されます。

`sourceC`が追加された場合:
* `outputB`がアグリゲーティングの場合、`sourceC`と`sourceB`の両方が再処理されます。
* `outputB`がアイソレーティングの場合、`sourceC`のみが再処理されます。

`sourceA`が削除された場合、何も再処理する必要はありません。

`sourceB`が削除された場合、何も再処理する必要はありません。

## ファイルのダーティネスはどのように決定されるか

ダーティファイルは、ユーザーによって直接 _変更_ されたか、他のダーティファイルによって間接的に _影響_ を受けたかのいずれかです。KSPはダーティネスを2つのステップで伝播させます:
*   _解決追跡_ による伝播:
    型参照（暗黙的または明示的）を解決することが、あるファイルから別のファイルへ移動する唯一の方法です。プロセッサーによって型参照が解決されたとき、解決結果に潜在的に影響を与える可能性のある変更を含む変更済みまたは影響を受けたファイルは、その参照を含むファイルに影響を与えます。
*   _入出力対応_ による伝播:
    ソースファイルが変更または影響を受けた場合、そのファイルと共通の出力を持つ他のすべてのソースファイルが影響を受けます。

これらはいずれも推移的であり、2番目のもの（入出力対応）は同値類を形成することに注意してください。

## バグの報告

バグを報告するには、Gradleプロパティ`ksp.incremental=true`と`ksp.incremental.log=true`を設定し、クリーンビルドを実行してください。
このビルドにより、以下の2つのログファイルが生成されます。

*   `build/kspCaches/<source set>/logs/kspDirtySet.log`
*   `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

その後、連続するインクリメンタルビルドを実行すると、さらに2つのログファイルが生成されます。

*   `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
*   `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

これらのログには、ソースと出力のファイル名、およびビルドのタイムスタンプが含まれています。