---
title: "Kotlin Metadata JVM 函式庫"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 函式庫提供工具，用於讀取、修改和產生從為 JVM 編譯的 Kotlin 類別的中繼資料 (metadata)。
此中繼資料儲存在 `.class` 檔案內的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 註解中，
並由函式庫和工具 (例如 [`kotlin-reflect`](reflection)) 用於在運行時檢查 Kotlin 特定的結構，例如屬性、函式和類別。

:::note
`kotlin-reflect` 函式庫依賴中繼資料，以在運行時檢索 Kotlin 特定的類別詳細資訊。
中繼資料和實際 `.class` 檔案之間的任何不一致，都可能導致在使用反射 (reflection) 時出現不正確的行為。

您也可以使用 Kotlin Metadata JVM 函式庫來檢查各種宣告屬性，例如可見性 (visibility) 或模態 (modality)，或產生中繼資料並將其嵌入到 `.class` 檔案中。

## 將函式庫新增至您的專案

若要在您的專案中包含 Kotlin Metadata JVM 函式庫，請根據您的建置工具新增相應的依賴配置 (dependency configuration)。

Kotlin Metadata JVM 函式庫遵循與 Kotlin 編譯器和標準函式庫相同的版本控制。
請確保您使用的版本與專案的 Kotlin 版本相符。

:::

### Gradle

將以下依賴項新增至您的 `build.gradle(.kts)` 檔案：

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

將以下依賴項新增至您的 `pom.xml` 檔案。

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

## 讀取和解析中繼資料

`kotlin-metadata-jvm` 函式庫從已編譯的 Kotlin `.class` 檔案中提取結構化資訊，例如類別名稱、可見性 (visibility) 和簽名 (signature)。
您可以在需要分析已編譯的 Kotlin 宣告的專案中使用它。
例如，[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依賴 `kotlin-metadata-jvm` 來列印公共 API 宣告。

您可以從已編譯的類別中使用反射 (reflection) 檢索 `@Metadata` 註解，以開始探索 Kotlin 類別中繼資料：

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

在檢索 `@Metadata` 註解後，請使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 函式或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函式來解析它。
這些函式提取關於類別或檔案的詳細資訊，同時滿足不同的相容性要求：

* `readLenient()`：使用此函式讀取中繼資料，包括由較新 Kotlin 編譯器版本產生的中繼資料。此函式不支援修改或寫入中繼資料。
* `readStrict()`：當您需要修改和寫入中繼資料時，請使用此函式。`readStrict()` 函式僅適用於由您的專案完全支援的 Kotlin 編譯器版本所產生的中繼資料。

    > `readStrict()` 函式支援高達 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 之後一個版本的中繼資料格式，這與專案中使用的最新 Kotlin 版本相對應。
    > 例如，如果您的專案依賴於 `kotlin-metadata-jvm:2.1.0`，則 `readStrict()` 可以處理高達 Kotlin `2.2.x` 的中繼資料；否則，它會拋出錯誤以防止錯誤處理未知格式。
    > 
    > 如需更多資訊，請參閱 [Kotlin Metadata GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#detailed-explanation)。
    >
    

在解析中繼資料時，`KotlinClassMetadata` 實例提供關於類別或檔案層級宣告的結構化資訊。
對於類別，請使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 屬性來分析詳細的類別層級中繼資料，例如類別名稱、函式、屬性和屬性 (如可見性)。
對於檔案層級宣告，中繼資料由 `kmPackage` 屬性表示，該屬性包含來自 Kotlin 編譯器產生的檔案外觀模式 (file facades) 的頂層函式和屬性。

以下程式碼範例示範如何使用 `readLenient()` 來解析中繼資料、使用 `kmClass` 分析類別層級詳細資訊，以及使用 `kmPackage` 檢索檔案層級宣告：

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

### 從位元組碼提取中繼資料

雖然您可以使用反射 (reflection) 檢索中繼資料，但另一種方法是使用位元組碼操作框架 (bytecode manipulation framework) (例如 [ASM](https://asm.ow2.io/)) 從位元組碼中提取它。

您可以按照以下步驟進行此操作：

1. 使用 ASM 函式庫的 `ClassReader` 類別讀取 `.class` 檔案的位元組碼。
   這個類別處理已編譯的檔案並填入 `ClassNode` 物件，該物件表示類別結構。
2. 從 `ClassNode` 物件提取 `@Metadata`。以下範例使用自訂擴充函式 `findAnnotation()` 來執行此操作。
3. 使用 `KotlinClassMetadata.readLenient()` 函式解析提取的中繼資料。
4. 使用 `kmClass` 和 `kmPackage` 屬性檢查已解析的中繼資料。

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
        kmClass.functions.forEach { function `->`
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 修改中繼資料

當使用 [ProGuard](https://github.com/Guardsquare/proguard) 等工具來縮減和最佳化位元組碼時，某些宣告可能會從 `.class` 檔案中移除。
ProGuard 會自動更新中繼資料，以使其與修改後的位元組碼保持一致。

但是，如果您正在開發以類似方式修改 Kotlin 位元組碼的自訂工具，則需要確保相應地調整中繼資料。
使用 `kotlin-metadata-jvm` 函式庫，您可以更新宣告、調整屬性並移除特定元素。

例如，如果您使用 JVM 工具從 Java 類別檔案中刪除私有方法，您還必須從 Kotlin 中繼資料中刪除私有函式，以保持一致性：

1. 使用 `readStrict()` 函式將 `@Metadata` 註解載入到結構化的 `KotlinClassMetadata` 物件中，以解析中繼資料。
2. 透過直接在 `kmClass` 或其他中繼資料結構中調整中繼資料 (例如篩選函式或變更屬性) 來套用修改。
3. 使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函式將修改後的中繼資料編碼為新的 `@Metadata` 註解。

以下是一個從類別中繼資料中移除私有函式的範例：

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
您可以改用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函式，而不是單獨呼叫 `readStrict()` 和 `write()`。
此函式解析中繼資料、透過 Lambda 運算式套用轉換，並自動寫入修改後的中繼資料。

:::

## 從頭開始建立中繼資料

若要使用 Kotlin Metadata JVM 函式庫從頭開始建立 Kotlin 類別檔案的中繼資料：

1. 根據您要產生的中繼資料類型，建立 `KmClass`、`KmPackage` 或 `KmLambda` 的實例。
2. 將屬性新增至實例，例如類別名稱、可見性 (visibility)、建構函式和函式簽名 (function signatures)。

    > 您可以使用 `apply()` [範圍函式](scope-functions) 來減少設定屬性時的樣板程式碼 (boilerplate code)。
    >
    

3. 使用此實例建立 `KotlinClassMetadata` 物件，該物件可以產生 `@Metadata` 註解。
4. 指定中繼資料版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，並設定旗標 (若沒有旗標則為 `0`，或在必要時從現有檔案複製旗標)。
5. 使用 [ASM](https://asm.ow2.io/) 中的 `ClassWriter` 類別將中繼資料欄位 (例如 `kind`、`data1` 和 `data2`) 嵌入到 `.class` 檔案中。

以下範例示範如何為簡單的 Kotlin 類別建立中繼資料：

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
如需更詳細的範例，請參閱 [Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。

:::

## 後續步驟

* [請參閱 Kotlin Metadata JVM 函式庫的 API 參考資料](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [查看 Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [瞭解模組中繼資料以及如何使用 `.kotlin_module` 檔案](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#module-metadata)。