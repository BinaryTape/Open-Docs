[//]: # (title: Kotlin Metadata JVMライブラリ)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)ライブラリは、JVM向けにコンパイルされたKotlinクラスからメタデータを読み取り、変更し、生成するためのツールを提供します。
`.class`ファイル内の[`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/)アノテーションに格納されているこのメタデータは、
[`kotlin-reflect`](reflection.md)などのライブラリやツールによって、プロパティ、関数、クラスといったKotlin固有の構成要素をランタイムで検査するために使用されます。

> `kotlin-reflect`ライブラリは、ランタイムでKotlin固有のクラス詳細を取得するためにメタデータに依存しています。
> メタデータと実際の`.class`ファイルとの間に不整合があると、リフレクション使用時に誤った動作を引き起こす可能性があります。
> 
{style="warning"}

Kotlin Metadata JVMライブラリを使用して、可視性やモダリティなどのさまざまな宣言属性を検査したり、メタデータを生成して`.class`ファイルに組み込んだりすることもできます。

## プロジェクトにライブラリを追加する

Kotlin Metadata JVMライブラリをプロジェクトに含めるには、使用しているビルドツールに基づいて対応する依存関係の構成を追加します。

> Kotlin Metadata JVMライブラリは、Kotlinコンパイラおよび標準ライブラリと同じバージョン管理に従います。
> 使用するバージョンがプロジェクトのKotlinバージョンと一致していることを確認してください。
> 
{style="note"}

### Gradle

以下の依存関係を`build.gradle(.kts)`ファイルに追加します。

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

以下の依存関係を`pom.xml`ファイルに追加します。

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

## メタデータを読み取り、パースする

`kotlin-metadata-jvm`ライブラリは、コンパイルされたKotlinの`.class`ファイルから、クラス名、可視性、シグネチャなどの構造化された情報を抽出します。
コンパイルされたKotlinの宣言を分析する必要があるプロジェクトでこれを使用できます。
例えば、[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator)は、`kotlin-metadata-jvm`に依存して公開API宣言を出力します。

コンパイルされたクラスからリフレクションを使用して`@Metadata`アノテーションを取得することで、Kotlinクラスのメタデータの調査を開始できます。

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

`@Metadata`アノテーションを取得したら、[`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) APIの[`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html)または[`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html)関数のいずれかを使用してそれをパースします。
これらの関数は、異なる互換性要件に対応しながら、クラスやファイルに関する詳細情報を抽出します。

*   `readLenient()`: この関数は、新しいKotlinコンパイラバージョンによって生成されたメタデータを含むメタデータを読み取るために使用します。この関数はメタデータの変更や書き込みをサポートしていません。
*   `readStrict()`: この関数は、メタデータを変更および書き込む必要がある場合に使用します。`readStrict()`関数は、プロジェクトによって完全にサポートされているKotlinコンパイラバージョンによって生成されたメタデータでのみ動作します。

    > `readStrict()`関数は、プロジェクトで使用されている最新のKotlinバージョンに対応する[`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html)より1つ先のバージョンまでのメタデータ形式をサポートしています。
    > 例えば、プロジェクトが`kotlin-metadata-jvm:2.1.0`に依存している場合、`readStrict()`はKotlin `2.2.x`までのメタデータを処理できます。そうでない場合、不明な形式の誤処理を防ぐためにエラーをスローします。
    > 
    > 詳細については、[Kotlin Metadata GitHubリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)を参照してください。
    >
    {style="note"}

メタデータをパースする際、`KotlinClassMetadata`インスタンスはクラスまたはファイルレベルの宣言に関する構造化された情報を提供します。
クラスの場合、[`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html)プロパティを使用して、クラス名、関数、プロパティ、可視性などの属性といった詳細なクラスレベルのメタデータを分析します。
ファイルレベルの宣言の場合、メタデータは`kmPackage`プロパティによって表され、Kotlinコンパイラによって生成されたファイルファサードのトップレベルの関数とプロパティが含まれます。

次のコード例は、`readLenient()`を使用してメタデータをパースし、`kmClass`でクラスレベルの詳細を分析し、`kmPackage`でファイルレベルの宣言を取得する方法を示しています。

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
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // Iterates over functions and checks visibility
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // Iterates over functions and checks visibility
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

### メタデータ内のアノテーションの書き込みと読み取り
<primary-label ref="experimental-general"/>

Kotlinメタデータにアノテーションを格納し、`kotlin-metadata-jvm`ライブラリを使用してそれらにアクセスできます。
これにより、シグネチャによるアノテーションの一致の必要がなくなり、オーバーロードされた宣言へのアクセスがより信頼性の高いものになります。

コンパイルされたファイルのメタデータでアノテーションを利用できるようにするには、以下のコンパイラオプションを追加します。

```kotlin
-Xannotations-in-metadata
```

あるいは、Gradleビルドファイルの`compilerOptions {}`ブロックに追加することもできます。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

このオプションを有効にすると、KotlinコンパイラはJVMバイトコードと並行してメタデータにアノテーションを書き込み、それらが`kotlin-metadata-jvm`ライブラリからアクセス可能になります。

ライブラリは、アノテーションにアクセスするための以下のAPIを提供します。

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

これらのAPIは[実験的](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalAnnotationsInMetadata::class)`アノテーションを使用します。

以下は、Kotlinメタデータからアノテーションを読み取る例です。

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

> プロジェクトで`kotlin-metadata-jvm`ライブラリを使用している場合は、アノテーションをサポートするためにコードを更新およびテストすることをお勧めします。
> そうしないと、将来のKotlinバージョンでメタデータ内のアノテーションが[デフォルトで有効](https://youtrack.jetbrains.com/issue/KT-75736)になった場合、プロジェクトが無効なまたは不完全なメタデータを生成する可能性があります。
>
> 問題が発生した場合は、[課題トラッカー](https://youtrack.jetbrains.com/issue/KT-31857)にご報告ください。
>
{style="warning"}

### バイトコードからメタデータを抽出する

リフレクションを使用してメタデータを取得することもできますが、別の方法として、[ASM](https://asm.ow2.io/)などのバイトコード操作フレームワークを使用してバイトコードから抽出する方法があります。

これを行うには、以下の手順に従います。

1.  ASMライブラリの`ClassReader`クラスを使用して、`.class`ファイルのバイトコードを読み取ります。このクラスは、コンパイルされたファイルを処理し、クラス構造を表す`ClassNode`オブジェクトを生成します。
2.  `ClassNode`オブジェクトから`@Metadata`を抽出します。以下の例では、これにカスタム拡張関数`findAnnotation()`を使用しています。
3.  抽出されたメタデータを`KotlinClassMetadata.readLenient()`関数を使用してパースします。
4.  パースされたメタデータを`kmClass`および`kmPackage`プロパティで検査します。

以下に例を示します。

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
        kmClass.functions.forEach { function ->
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## メタデータを変更する

[ProGuard](https://github.com/Guardsquare/proguard)のようなツールを使用してバイトコードを縮小および最適化する場合、一部の宣言が`.class`ファイルから削除されることがあります。
ProGuardは、変更されたバイトコードと整合性を保つためにメタデータを自動的に更新します。

ただし、Kotlinバイトコードを同様の方法で変更するカスタムツールを開発している場合、メタデータがそれに応じて調整されることを確認する必要があります。
`kotlin-metadata-jvm`ライブラリを使用すると、宣言を更新したり、属性を調整したり、特定の要素を削除したりできます。

例えば、Javaクラスファイルからprivateメソッドを削除するJVMツールを使用する場合、整合性を維持するためにKotlinメタデータからもprivate関数を削除する必要があります。

1.  `readStrict()`関数を使用してメタデータをパースし、`@Metadata`アノテーションを構造化された`KotlinClassMetadata`オブジェクトにロードします。
2.  `kmClass`またはその他のメタデータ構造内で直接、関数をフィルタリングしたり属性を変更したりするなど、メタデータを調整して変更を適用します。
3.  [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html)関数を使用して、変更されたメタデータを新しい`@Metadata`アノテーションにエンコードします。

以下に、クラスのメタデータからprivate関数を削除する例を示します。

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

> `readStrict()`と`write()`を個別に呼び出す代わりに、[`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html)関数を使用できます。
> この関数はメタデータをパースし、ラムダを介して変換を適用し、変更されたメタデータを自動的に書き込みます。
> 
{style="tip"}

## メタデータをゼロから作成する

Kotlin Metadata JVMライブラリを使用してKotlinクラスファイルのメタデータをゼロから作成するには：

1.  生成したいメタデータの種類に応じて、`KmClass`、`KmPackage`、または`KmLambda`のインスタンスを作成します。
2.  クラス名、可視性、コンストラクタ、関数シグネチャなどの属性をインスタンスに追加します。

    > プロパティを設定する際に、ボイラープレートコードを減らすために`apply()`[スコープ関数](scope-functions.md)を使用できます。
    >
    {style="tip"}

3.  インスタンスを使用して`KotlinClassMetadata`オブジェクトを作成し、`@Metadata`アノテーションを生成できるようにします。
4.  `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`などのメタデータバージョンを指定し、フラグを設定します（フラグなしの場合は`0`、必要に応じて既存のファイルからフラグをコピーします）。
5.  [ASM](https://asm.ow2.io/)の`ClassWriter`クラスを使用して、`kind`、`data1`、`data2`などのメタデータフィールドを`.class`ファイルに埋め込みます。

次の例は、単純なKotlinクラスのメタデータを作成する方法を示しています。

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

> より詳細な例については、[Kotlin Metadata JVM GitHubリポジトリ](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)を参照してください。
> 
{style="tip"}

## 次のステップ

*   [Kotlin Metadata JVMライブラリのAPIリファレンスを参照する](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
*   [Kotlin Metadata JVM GitHubリポジトリを確認する](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
*   [モジュールメタデータと`.kotlin_module`ファイルの操作について学ぶ](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。