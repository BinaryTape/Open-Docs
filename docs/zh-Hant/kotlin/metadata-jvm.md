[//]: # (title: Kotlin 中繼資料 JVM 函式庫)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 函式庫提供了工具，用於讀取、修改及產生為 JVM 編譯的 Kotlin 類別中的中繼資料。這些儲存在 `.class` 檔案中 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 註解 (annotation) 裡的中繼資料，被諸如 [`kotlin-reflect`](reflection.md) 等函式庫和工具使用，以在執行時期 (runtime) 檢查 Kotlin 特有的建構 (constructs)，例如屬性 (properties)、函式 (functions) 和類別 (classes)。

> `kotlin-reflect` 函式庫依賴中繼資料以在執行時期擷取 Kotlin 特有的類別細節。中繼資料與實際 `.class` 檔案之間的任何不一致，在使用反射 (reflection) 時，可能會導致不正確的行為。
> 
{style="warning"}

您也可以使用 Kotlin 中繼資料 JVM 函式庫來檢查各種宣告屬性 (attributes)，例如可見性 (visibility) 或模態 (modality)，或產生並嵌入中繼資料到 `.class` 檔案中。

## 將函式庫新增至您的專案

若要將 Kotlin 中繼資料 JVM 函式庫包含在您的專案中，請根據您的建置工具 (build tool) 新增對應的依賴項 (dependency) 配置 (configuration)。

> Kotlin 中繼資料 JVM 函式庫遵循與 Kotlin 編譯器 (compiler) 和標準函式庫 (standard library) 相同的版本控制。確保您使用的版本與您專案的 Kotlin 版本相符。
> 
{style="note"}

### Gradle

請將以下依賴項新增至您的 `build.gradle(.kts)` 檔案中：

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

請將以下依賴項新增至您的 `pom.xml` 檔案中。

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

## 讀取及解析中繼資料

`kotlin-metadata-jvm` 函式庫從編譯過的 Kotlin `.class` 檔案中提取結構化資訊，例如類別名稱、可見性及簽章 (signatures)。您可以在需要分析編譯過的 Kotlin 宣告 (declarations) 的專案中使用它。例如，[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依賴 `kotlin-metadata-jvm` 以列印 (print) 公開 (public) API 宣告。

您可以透過使用反射從編譯過的類別中擷取 `@Metadata` 註解來開始探索 Kotlin 類別中繼資料：

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

擷取 `@Metadata` 註解後，請使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函式來解析它。這些函式提取關於類別或檔案的詳細資訊，同時解決不同的相容性 (compatibility) 要求：

*   `readLenient()`：使用此函式讀取中繼資料，包括由較新版本 Kotlin 編譯器生成的 (generated) 中繼資料。此函式不支援修改或寫入中繼資料。
*   `readStrict()`：當您需要修改和寫入中繼資料時，請使用此函式。`readStrict()` 函式僅適用於由您專案完全支援的 Kotlin 編譯器版本所生成的中繼資料。

    > `readStrict()` 函式支援中繼資料格式最多比 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 高一個版本，這與專案中使用的最新 Kotlin 版本相對應。例如，如果您的專案依賴 `kotlin-metadata-jvm:2.1.0`，`readStrict()` 可以處理高達 Kotlin `2.2.x` 的中繼資料；否則，它會拋出錯誤 (throws an error) 以防止對未知格式的誤處理 (mishandling)。
    > 
    > 如需更多資訊，請參閱 [Kotlin 中繼資料 GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)。
    >
    {style="note"}

解析中繼資料時，`KotlinClassMetadata` 實例 (instance) 提供關於類別或檔案級別宣告的結構化資訊。對於類別，使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 屬性來分析詳細的類別級別中繼資料，例如類別名稱、函式、屬性，以及像可見性這樣的屬性。對於檔案級別的宣告，中繼資料由 `kmPackage` 屬性表示，它包含由 Kotlin 編譯器生成的檔案外觀 (file facades) 中的頂層函式 (top-level functions) 和屬性。

以下程式碼範例演示了如何使用 `readLenient()` 解析中繼資料，使用 `kmClass` 分析類別級別的詳細資訊，並使用 `kmPackage` 擷取檔案級別的宣告：

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

### 從位元組碼中提取中繼資料

雖然您可以使用反射擷取中繼資料，但另一種方法是從位元組碼 (bytecode) 中提取它，使用諸如 [ASM](https://asm.ow2.io/) 這樣的位元組碼操作框架 (framework)。

您可以依照以下步驟進行：

1.  讀取 `.class` 檔案的位元組碼，使用 ASM 函式庫的 `ClassReader` 類別。此類別處理編譯過的檔案並填充 (populates) `ClassNode` 物件 (object)，該物件代表類別結構。
2.  從 `ClassNode` 物件中提取 `@Metadata`。下面的範例為此使用了自訂擴充功能 (extension function) `findAnnotation()`。
3.  解析提取出的中繼資料，使用 `KotlinClassMetadata.readLenient()` 函式。
4.  檢查解析後的中繼資料，使用 `kmClass` 和 `kmPackage` 屬性。

以下是一個範例：

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

## 修改中繼資料

當使用像 [ProGuard](https://github.com/Guardsquare/proguard) 這樣的工具來縮減 (shrink) 和最佳化 (optimize) 位元組碼時，有些宣告可能會從 `.class` 檔案中移除。ProGuard 會自動更新中繼資料，以使其與修改過的位元組碼保持一致 (consistent)。

然而，如果您正在開發一個以類似方式修改 Kotlin 位元組碼的自訂工具，您需要確保中繼資料也相應地進行調整 (adjusted)。使用 `kotlin-metadata-jvm` 函式庫，您可以更新宣告、調整屬性以及移除特定元素 (elements)。

例如，如果您使用一個 JVM 工具，從 Java 類別檔案中刪除私有 (private) 方法 (methods)，您也必須從 Kotlin 中繼資料中刪除私有函式 (functions)，以保持一致性：

1.  透過使用 `readStrict()` 函式，將 `@Metadata` 註解載入 (load) 到結構化的 `KotlinClassMetadata` 物件中，從而解析中繼資料。
2.  透過調整中繼資料，例如過濾 (filtering) 函式或更改 (altering) 屬性，直接在 `kmClass` 或其他中繼資料結構中應用修改。
3.  使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函式將修改後的中繼資料編碼 (encode) 為新的 `@Metadata` 註解。

這是一個從類別中繼資料中移除私有函式的範例：

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

> 您可以改為使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函式，而不必單獨呼叫 `readStrict()` 和 `write()`。此函式解析中繼資料，透過 lambda 應用轉換 (transformations)，並自動寫入修改後的中繼資料。
> 
{style="tip"}

## 從頭開始建立中繼資料

若要使用 Kotlin 中繼資料 JVM 函式庫從頭開始建立 Kotlin 類別檔案的中繼資料：

1.  建立 `KmClass`、`KmPackage` 或 `KmLambda` 的實例，取決於您要生成的中繼資料類型。
2.  將屬性新增至實例，例如類別名稱、可見性、建構函式 (constructors) 和函式簽章。

    > 您可以使用 `apply()` 作用域函式 (scope function) 在設定屬性時減少樣板程式碼 (boilerplate code)。
    >
    {style="tip"}

3.  使用該實例建立 `KotlinClassMetadata` 物件，它可以生成 `@Metadata` 註解。
4.  指定中繼資料版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，並設定旗標 (flags)（`0` 表示沒有旗標，或必要時從現有檔案複製旗標）。
5.  使用來自 [ASM](https://asm.ow2.io/) 的 `ClassWriter` 類別，將中繼資料欄位 (fields)，例如 `kind`、`data1` 和 `data2` 嵌入到 `.class` 檔案中。

以下範例演示了如何為一個簡單的 Kotlin 類別建立中繼資料：

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

> 如需更詳細的範例，請參閱 [Kotlin 中繼資料 JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。
> 
{style="tip"}

## 接下來是什麼

*   [參閱 Kotlin 中繼資料 JVM 函式庫的 API 參考文件](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
*   [查看 Kotlin 中繼資料 JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
*   [了解模組中繼資料 (module metadata) 以及如何使用 `.kotlin_module` 檔案](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。