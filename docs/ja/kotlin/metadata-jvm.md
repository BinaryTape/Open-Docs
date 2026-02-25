[//]: # (title: Kotlin Metadata JVM ライブラリ)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) ライブラリは、JVM 用にコンパイルされた Kotlin クラスからメタデータを読み取り、変更し、生成するためのツールを提供します。
このメタデータは `.class` ファイル内の [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) アノテーションに保存されており、[`kotlin-reflect`](reflection.md) などのライブラリやツールが、実行時にプロパティ、関数、クラスなどの Kotlin 固有の構造を検査するために使用されます。

> `kotlin-reflect` ライブラリは、実行時に Kotlin 固有のクラスの詳細を取得するためにメタデータに依存しています。
> メタデータと実際の `.class` ファイルの間に不整合があると、リフレクションを使用する際に正しくない動作を引き起こす可能性があります。
> 
{style="warning"}

また、Kotlin Metadata JVM ライブラリを使用して、可視性（visibility）やモダリティ（modality）などのさまざまな宣言属性を検査したり、メタデータを生成して `.class` ファイルに埋め込んだりすることもできます。

## プロジェクトへのライブラリの追加

プロジェクトに Kotlin Metadata JVM ライブラリを含めるには、ビルドツールに基づいて対応する依存関係の設定を追加します。

> Kotlin Metadata JVM ライブラリは、Kotlin コンパイラおよび標準ライブラリと同じバージョニングに従います。
> 使用するバージョンがプロジェクトの Kotlin バージョンと一致していることを確認してください。
> 
{style="note"}

### Gradle

`build.gradle(.kts)` ファイルに以下の依存関係を追加します。

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%'
}
```
</tab>
</tabs>

### Maven

`pom.xml` ファイルに以下の依存関係を追加します。

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-metadata-jvm</artifactId>
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

## メタデータの読み取りとパース

`kotlin-metadata-jvm` ライブラリは、コンパイル済みの Kotlin `.class` ファイルから、クラス名、可視性、シグネチャなどの構造化された情報を抽出します。
コンパイル済みの Kotlin 宣言を分析する必要があるプロジェクトで使用できます。
例えば、[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) は、公開 API 宣言を出力するために `kotlin-metadata-jvm` に依存しています。

リフレクションを使用してコンパイル済みクラスから `@Metadata` アノテーションを取得することで、Kotlin クラスのメタデータの探索を開始できます。

```kotlin
fun main() {
    // クラスの完全修飾名を指定
    val clazz = Class.forName("org.example.SampleClass")

    // @Metadata アノテーションを取得
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // メタデータが存在するか確認
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

`@Metadata` アノテーションを取得した後、[`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API の [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) または [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 関数のいずれかを使用してパースします。
これらの関数は、異なる互換性要件に対応しつつ、クラスやファイルに関する詳細な情報を抽出します。

* `readLenient()`: 新しい Kotlin コンパイラバージョンで生成されたメタデータを含め、メタデータの読み取りに使用します。この関数はメタデータの変更や書き込みをサポートしていません。
* `readStrict()`: メタデータの変更や書き込みが必要な場合に使用します。`readStrict()` 関数は、プロジェクトで完全にサポートされている Kotlin コンパイラバージョンによって生成されたメタデータに対してのみ機能します。

    > `readStrict()` 関数は、プロジェクトで使用されている最新の Kotlin バージョンに対応する [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) より 1 バージョン先までのメタデータ形式をサポートしています。
    > 例えば、プロジェクトが `kotlin-metadata-jvm:2.1.0` に依存している場合、`readStrict()` は Kotlin `2.2.x` までのメタデータを処理できます。それ以上の場合は、未知の形式の誤った取り扱いを防ぐためにエラーをスローします。
    > 
    > 詳細については、[Kotlin Metadata GitHub リポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)を参照してください。
    >
    {style="note"}

メタデータをパースすると、`KotlinClassMetadata` インスタンスはクラスまたはファイルレベルの宣言に関する構造化された情報を提供します。
クラスの場合は、[`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) プロパティを使用して、クラス名、関数、プロパティ、可視性などの属性といった詳細なクラスレベルのメタデータを分析します。
ファイルレベルの宣言の場合、メタデータは `kmPackage` プロパティによって表され、これには Kotlin コンパイラによって生成されたファイルファサードからのトップレベルの関数やプロパティが含まれます。

以下のコード例は、`readLenient()` を使用してメタデータをパースし、`kmClass` でクラスレベルの詳細を分析し、`kmPackage` でファイルレベルの宣言を取得する方法を示しています。

```kotlin
// 必要なライブラリをインポート
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // クラスの完全修飾名を指定
    val className = "org.example.SampleClass"

    try {
        // 指定された名前のクラスオブジェクトを取得
        val clazz = Class.forName(className)

        // @Metadata アノテーションを取得
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // readLenient() 関数を使用してメタデータをパース
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // 関数を反復処理し、可視性を確認
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 関数を反復処理し、可視性を確認
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                else -> {
                    println("Unsupported metadata type: $metadata")
                }
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

### メタデータ内でのアノテーションの書き込みと読み取り
<primary-label ref="experimental-general"/>

Kotlin メタデータ内にアノテーションを保存し、`kotlin-metadata-jvm` ライブラリを使用してそれらにアクセスすることができます。
これにより、シグネチャによってアノテーションを照合する必要がなくなり、オーバーロードされた宣言へのアクセスがより確実になります。

コンパイルされたファイルのメタデータでアノテーションを利用可能にするには、以下のコンパイラオプションを追加します。

```kotlin
-Xannotations-in-metadata
```

または、Gradle ビルドファイルの `compilerOptions {}` ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

このオプションを有効にすると、Kotlin コンパイラは JVM バイトコードと共にメタデータ内にアノテーションを書き込み、`kotlin-metadata-jvm` ライブラリからアクセスできるようにします。

ライブラリはアノテーションにアクセスするための以下の API を提供します。

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

これらの API は[実験的（Experimental）](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalAnnotationsInMetadata::class)` アノテーションを使用します。

以下は、Kotlin メタデータからアノテーションを読み取る例です。

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> プロジェクトで `kotlin-metadata-jvm` ライブラリを使用している場合は、アノテーションをサポートするようにコードを更新し、テストすることをお勧めします。
> そうしないと、将来の Kotlin バージョンでメタデータ内のアノテーションが[デフォルトで有効](https://youtrack.jetbrains.com/issue/KT-75736)になったときに、プロジェクトが不正または不完全なメタデータを生成する可能性があります。
>
> 問題が発生した場合は、[課題トラッカー（issue tracker）](https://youtrack.jetbrains.com/issue/KT-31857)に報告してください。
>
{style="warning"}

### バイトコードからのメタデータの抽出

リフレクションを使用してメタデータを取得することもできますが、[ASM](https://asm.ow2.io/) などのバイトコード操作フレームワークを使用してバイトコードから抽出するアプローチもあります。

これは以下の手順で行うことができます。

1. ASM ライブラリの `ClassReader` クラスを使用して、`.class` ファイルのバイトコードを読み取ります。
   このクラスはコンパイルされたファイルを処理し、クラス構造を表す `ClassNode` オブジェクトにデータを投入します。
2. `ClassNode` オブジェクトから `@Metadata` を抽出します。以下の例では、このためにカスタム拡張関数 `findAnnotation()` を使用しています。
3. `KotlinClassMetadata.readLenient()` 関数を使用して、抽出されたメタデータをパースします。
4. `kmClass` および `kmPackage` プロパティを使用して、パースされたメタデータを検査します。

以下に例を示します。

```kotlin
// 必要なライブラリをインポート
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// アノテーションが特定の名前を参照しているか確認
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// キーによってアノテーションの値を取得
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// ClassNode 内で名前によってアノテーションを検索するカスタム拡張関数を定義
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// アノテーションの値を簡単に取得するための演算子
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// クラスノードから Kotlin メタデータを抽出
fun ClassNode.readMetadataLenient(): KotlinClassMetadata? {
    val metadataAnnotation = findAnnotation("kotlin/Metadata", false) ?: return null
    @Suppress("UNCHECKED_CAST")
    val metadata = Metadata(
        kind = metadataAnnotation["k"] as Int?,
        metadataVersion = (metadataAnnotation["mv"] as List<Int>?)?.toIntArray(),
        data1 = (metadataAnnotation["d1"] as List<String>?)?.toTypedArray(),
        data2 = (metadataAnnotation["d2"] as List<String>?)?.toTypedArray(),
        extraString = metadataAnnotation["xs"] as String?,
        packageName = metadataAnnotation["pn"] as String?,
        extraInt = metadataAnnotation["xi"] as Int?
    )
    return KotlinClassMetadata.readLenient(metadata)
}

// バイトコード検査のためにファイルを ClassNode に変換
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // バイトコードを読み取り、ClassNode オブジェクトに処理
    val classNode = classFile.toClassNode()

    // @Metadata アノテーションを特定し、寛容に読み取る
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // パースされたメタデータを検査
        val kmClass = metadata.kmClass

        // クラスの詳細を出力
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## メタデータの変更

バイトコードを縮小および最適化するために [ProGuard](https://github.com/Guardsquare/proguard) などのツールを使用すると、`.class` ファイルから一部の宣言が削除されることがあります。
ProGuard は、変更されたバイトコードとの整合性を保つために、メタデータを自動的に更新します。

ただし、同様の方法で Kotlin バイトコードを変更するカスタムツールを開発している場合は、メタデータがそれに応じて調整されていることを確認する必要があります。
`kotlin-metadata-jvm` ライブラリを使用すると、宣言の更新、属性の調整、特定の要素の削除を行うことができます。

例えば、Java クラスファイルから private メソッドを削除する JVM ツールを使用する場合、一貫性を維持するために Kotlin メタデータからも private 関数を削除する必要があります。

1. `readStrict()` 関数を使用して `@Metadata` アノテーションを構造化された `KotlinClassMetadata` オブジェクトにロードし、メタデータをパースします。
2. `kmClass` またはその他のメタデータ構造内で、関数のフィルタリングや属性の変更などを行って、メタデータを調整し、変更を適用します。
3. [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 関数を使用して、変更されたメタデータを新しい `@Metadata` アノテーションにエンコードします。

以下は、クラスのメタデータから private 関数が削除される例です。

```kotlin
// 必要なライブラリをインポート
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // クラスの完全修飾名を指定
    val className = "org.example.SampleClass"

    try {
        // 指定された名前のクラスオブジェクトを取得
        val clazz = Class.forName(className)

        // @Metadata アノテーションを取得
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // readStrict() 関数を使用してメタデータをパース
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // クラスメタデータから private 関数を削除
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // 変更されたメタデータを再度シリアライズ
                val newMetadata = metadata.write()
                // メタデータを変更した後、それをクラスファイルに書き込む必要があります
                // そのためには、ASM などのバイトコード操作フレームワークを使用できます
                
                println("Modified metadata: ${newMetadata}")
            } else {
                println("The metadata is not a class.")
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

> `readStrict()` と `write()` を個別に呼び出す代わりに、[`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 関数を使用できます。
> この関数はメタデータをパースし、ラムダを通じて変換を適用し、変更されたメタデータを自動的に書き込みます。
> 
{style="tip"}

## メタデータの新規作成

Kotlin Metadata JVM ライブラリを使用して Kotlin クラスファイルのメタデータをゼロから作成するには：

1. 生成したいメタデータのタイプに応じて、`KmClass`、`KmPackage`、または `KmLambda` のインスタンスを作成します。
2. クラス名、可視性、コンストラクタ、関数のシグネチャなどの属性をインスタンスに追加します。

    > プロパティを設定する際、`apply()` [スコープ関数](scope-functions.md)を使用すると、ボイラープレートコードを削減できます。
    >
    {style="tip"}

3. インスタンスを使用して `KotlinClassMetadata` オブジェクトを作成します。これにより `@Metadata` アノテーションを生成できます。
4. `JvmMetadataVersion.LATEST_STABLE_SUPPORTED` などのメタデータバージョンを指定し、フラグを設定します（フラグなしの場合は `0`、必要に応じて既存のファイルからフラグをコピーします）。
5. [ASM](https://asm.ow2.io/) の `ClassWriter` クラスを使用して、`kind`、`data1`、`data2` などのメタデータフィールドを `.class` ファイルに埋め込みます。

以下の例は、単純な Kotlin クラスのメタデータを作成する方法を示しています。

```kotlin
// 必要なライブラリをインポート
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // KmClass インスタンスを作成
    val klass = KmClass().apply {
        name = "Hello"
        visibility = Visibility.PUBLIC
        constructors += KmConstructor().apply {
            visibility = Visibility.PUBLIC
            signature = JvmMethodSignature("<init>", "()V")
        }
        functions += KmFunction("hello").apply {
            visibility = Visibility.PUBLIC
            returnType = KmType().apply {
                classifier = KmClassifier.Class("kotlin/String")
            }
            signature = JvmMethodSignature("hello", "()Ljava/lang/String;")
        }
    }

    // バージョンとフラグを含む KotlinClassMetadata.Class インスタンスを @kotlin.Metadata アノテーションにシリアライズ
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // ASM で .class ファイルを生成
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // @kotlin.Metadata インスタンスを .class ファイルに書き込む
        visitAnnotation("Lkotlin/Metadata;", true).apply {
            visit("mv", annotationData.metadataVersion)
            visit("k", annotationData.kind)
            visitArray("d1").apply {
                annotationData.data1.forEach { visit(null, it) }
                visitEnd()
            }
            visitArray("d2").apply {
                annotationData.data2.forEach { visit(null, it) }
                visitEnd()
            }
            visitEnd()
        }
        visitEnd()
    }.toByteArray()

    // 生成された .class ファイルをディスクに書き込む
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

> より詳細な例については、[Kotlin Metadata JVM GitHub リポジトリ](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)を参照してください。
> 
{style="tip"}

## 次のステップ

* [Kotlin Metadata JVM ライブラリの API リファレンスを見る](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [Kotlin Metadata JVM GitHub リポジトリを確認する](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [モジュールメタデータと `.kotlin_module` ファイルの取り扱いについて学ぶ](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。