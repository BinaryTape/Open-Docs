---
title: "Kotlin Metadata JVM ライブラリ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) ライブラリは、JVM 用にコンパイルされた Kotlin クラスからメタデータを読み取り、変更、生成するためのツールを提供します。
このメタデータは、`.class` ファイル内の [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) アノテーションに保存され、
[`kotlin-reflect`](reflection) などのライブラリやツールが、プロパティ、関数、
および実行時のクラスなど、Kotlin 固有の構成要素を検査するために使用されます。

:::note
`kotlin-reflect` ライブラリは、実行時に Kotlin 固有のクラスの詳細を取得するためにメタデータに依存しています。
メタデータと実際の `.class` ファイルとの間に不整合があると、リフレクションを使用する際に正しく動作しない可能性があります。

Kotlin Metadata JVM ライブラリを使用すると、可視性やモダリティなどのさまざまな宣言属性を検査したり、メタデータを生成して `.class` ファイルに埋め込んだりすることもできます。

## プロジェクトにライブラリを追加する

Kotlin Metadata JVM ライブラリをプロジェクトに含めるには、ビルドツールに基づいて対応する依存関係構成を追加します。

Kotlin Metadata JVM ライブラリは、Kotlin コンパイラおよび標準ライブラリと同じバージョン管理に従います。
使用するバージョンが、プロジェクトの Kotlin バージョンと一致していることを確認してください。

:::

### Gradle

`build.gradle(.kts)` ファイルに次の依存関係を追加します。

<Tabs groupId="build-tool">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-metadata-jvm:2.1.20")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-metadata-jvm:2.1.20'
}
```
</TabItem>
</Tabs>

### Maven

`pom.xml` ファイルに次の依存関係を追加します。

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-metadata-jvm</artifactId>
            <version>2.1.20</version>
        </dependency>
    </dependencies>
    ...
</project>
```

## メタデータを読み取り、解析する

`kotlin-metadata-jvm` ライブラリは、コンパイルされた Kotlin の `.class` ファイルから、クラス名、可視性、シグネチャなどの構造化された情報を抽出します。
コンパイルされた Kotlin の宣言を分析する必要があるプロジェクトで使用できます。
たとえば、[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) は、`kotlin-metadata-jvm` を使用して公開 API 宣言を出力します。

コンパイルされたクラスからリフレクションを使用して `@Metadata` アノテーションを取得することで、Kotlin クラスメタデータの探索を開始できます。

```kotlin
fun main() {
    // Specifies the fully qualified name of the class
    val clazz = Class.forName("org.example.SampleClass")

    // Retrieves the @Metadata annotation
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // Checks if the metadata is present
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

`@Metadata` アノテーションを取得したら、[`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API の [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 関数または [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 関数のいずれかを使用して解析します。
これらの関数は、クラスまたはファイルに関する詳細情報を抽出しながら、さまざまな互換性要件に対応します。

* `readLenient()`: 新しい Kotlin コンパイラバージョンで生成されたメタデータを含む、メタデータを読み取るには、この関数を使用します。この関数は、メタデータの変更または書き込みをサポートしていません。
* `readStrict()`: メタデータを変更および書き込む必要がある場合は、この関数を使用します。`readStrict()` 関数は、プロジェクトで完全にサポートされている Kotlin コンパイラバージョンで生成されたメタデータでのみ動作します。

    > `readStrict()` 関数は、[`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) を超える 1 つのバージョンまでのメタデータ形式をサポートします。これは、プロジェクトで使用されている最新の Kotlin バージョンに対応します。
    > たとえば、プロジェクトが `kotlin-metadata-jvm:2.1.0` に依存している場合、`readStrict()` は Kotlin `2.2.x` までのメタデータを処理できます。それ以外の場合は、不明な形式の誤った処理を防ぐためにエラーがスローされます。
    > 
    > 詳細については、[Kotlin Metadata GitHub リポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#detailed-explanation) を参照してください。
    >
    

メタデータを解析すると、`KotlinClassMetadata` インスタンスは、クラスまたはファイルレベルの宣言に関する構造化された情報を提供します。
クラスの場合は、[`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) プロパティを使用して、クラス名、関数、プロパティ、可視性などの属性など、詳細なクラスレベルのメタデータを分析します。
ファイルレベルの宣言の場合、メタデータは `kmPackage` プロパティで表されます。これには、Kotlin コンパイラによって生成されたファイルファサードからのトップレベルの関数とプロパティが含まれます。

次のコード例は、`readLenient()` を使用してメタデータを解析し、`kmClass` でクラスレベルの詳細を分析し、`kmPackage` でファイルレベルの宣言を取得する方法を示しています。

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // Specifies the fully qualified class name
    val className = "org.example.SampleClass"

    try {
        // Retrieves the class object for the specified name
        val clazz = Class.forName(className)

        // Retrieves the @Metadata annotation
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // Parses metadata using the readLenient() function
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class `->` {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // Iterates over functions and checks visibility
                    kmClass.functions.forEach { function `->`
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade `->` {
                    val kmPackage = metadata.kmPackage

                    // Iterates over functions and checks visibility
                    kmPackage.functions.forEach { function `->`
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                else `->` {
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

### バイトコードからメタデータを抽出する

リフレクションを使用してメタデータを取得できますが、もう 1 つのアプローチは、[ASM](https://asm.ow2.io/) などのバイトコード操作フレームワークを使用してバイトコードから抽出することです。

これを行うには、次の手順に従います。

1. ASM ライブラリの `ClassReader` クラスを使用して、`.class` ファイルのバイトコードを読み取ります。
   このクラスは、コンパイルされたファイルを処理し、クラス構造を表す `ClassNode` オブジェクトを設定します。
2. `ClassNode` オブジェクトから `@Metadata` を抽出します。以下の例では、このためにカスタム拡張関数 `findAnnotation()` を使用します。
3. `KotlinClassMetadata.readLenient()` 関数を使用して、抽出されたメタデータを解析します。
4. `kmClass` および `kmPackage` プロパティを使用して、解析されたメタデータを検査します。

次に例を示します。

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// Checks if an annotation refers to a specific name
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// Retrieves annotation values by key
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// Defines a custom extension function to locate an annotation by its name in a ClassNode
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// Operator to simplify retrieving annotation values
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// Extracts Kotlin metadata from a class node
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

// Converts a file to a ClassNode for bytecode inspection
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // Reads the bytecode and processes it into a ClassNode object
    val classNode = classFile.toClassNode()

    // Locates the @Metadata annotation and reads it leniently
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // Inspects the parsed metadata
        val kmClass = metadata.kmClass

        // Prints class details
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function `->`
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## メタデータを変更する

[ProGuard](https://github.com/Guardsquare/proguard) などのツールを使用してバイトコードを縮小および最適化する場合、一部の宣言が `.class` ファイルから削除される場合があります。
ProGuard は、メタデータを自動的に更新して、変更されたバイトコードとの整合性を保ちます。

ただし、同様の方法で Kotlin バイトコードを変更するカスタムツールを開発している場合は、それに応じてメタデータを調整する必要があります。
`kotlin-metadata-jvm` ライブラリを使用すると、宣言を更新したり、属性を調整したり、特定の要素を削除したりできます。

たとえば、Java クラスファイルからプライベートメソッドを削除する JVM ツールを使用する場合は、整合性を維持するために、Kotlin メタデータからプライベート関数も削除する必要があります。

1. `readStrict()` 関数を使用してメタデータを解析し、`@Metadata` アノテーションを構造化された `KotlinClassMetadata` オブジェクトにロードします。
2. `kmClass` またはその他のメタデータ構造内で直接、関数をフィルタリングしたり、属性を変更したりするなど、メタデータを調整して変更を適用します。
3. [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 関数を使用して、変更されたメタデータを新しい `@Metadata` アノテーションにエンコードします。

次に、クラスのメタデータからプライベート関数を削除する例を示します。

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // Specifies the fully qualified class name
    val className = "org.example.SampleClass"

    try {
        // Retrieves the class object for the specified name
        val clazz = Class.forName(className)

        // Retrieves the @Metadata annotation
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // Parses metadata using the readStrict() function
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // Removes private functions from the class metadata
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // Serializes the modified metadata back
                val newMetadata = metadata.write()
                // After modifying the metadata, you need to write it into the class file
                // To do so, you can use a bytecode manipulation framework such as ASM
                
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

:::tip
`readStrict()` と `write()` を別々に呼び出す代わりに、[`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 関数を使用できます。
この関数は、メタデータを解析し、ラムダを介して変換を適用し、変更されたメタデータを自動的に書き込みます。

:::

## メタデータを最初から作成する

Kotlin Metadata JVM ライブラリを使用して、Kotlin クラスファイルのメタデータを最初から作成するには:

1. 生成するメタデータの種類に応じて、`KmClass`、`KmPackage`、または `KmLambda` のインスタンスを作成します。
2. クラス名、可視性、コンストラクター、関数シグネチャなどの属性をインスタンスに追加します。

    > プロパティを設定する際に、ボイラープレートコードを削減するために、`apply()` [スコープ関数](scope-functions)を使用できます。
    >
    

3. インスタンスを使用して `KotlinClassMetadata` オブジェクトを作成します。これにより、`@Metadata` アノテーションを生成できます。
4. `JvmMetadataVersion.LATEST_STABLE_SUPPORTED` などのメタデータバージョンを指定し、フラグを設定します（フラグがない場合は `0`、または必要に応じて既存のファイルからフラグをコピーします）。
5. [ASM](https://asm.ow2.io/) の `ClassWriter` クラスを使用して、`kind`、`data1`、`data2` などのメタデータフィールドを `.class` ファイルに埋め込みます。

次の例は、単純な Kotlin クラスのメタデータを作成する方法を示しています。

```kotlin
// Imports the necessary libraries
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // Creates a KmClass instance
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

    // Serializes a KotlinClassMetadata.Class instance, including the version and flags, into a @kotlin.Metadata annotation
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // Generates a .class file with ASM
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // Writes @kotlin.Metadata instance to the .class file
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

    // Writes the generated class file to disk
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

:::tip
詳細な例については、[Kotlin Metadata JVM GitHub リポジトリ](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43) を参照してください。

:::

## 次のステップ

* [Kotlin Metadata JVM ライブラリの API リファレンスを参照してください](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [Kotlin Metadata JVM GitHub リポジトリを確認してください](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [モジュールメタデータと `.kotlin_module` ファイルの操作について学習してください](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#module-metadata)。