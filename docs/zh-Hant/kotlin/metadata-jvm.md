[//]: # (title: Kotlin Metadata JVM 函式庫)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 函式庫提供了用於讀取、修改及產生為 JVM 編譯的 Kotlin 類別中繼資料的工具。此中繼資料儲存在 `.class` 檔案內的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 註解中，並由 [`kotlin-reflect`](reflection.md) 等函式庫和工具用於在執行時檢查 Kotlin 特有的建構，例如屬性、函數和類別。

> `kotlin-reflect` 函式庫依賴於中繼資料以在執行時檢索 Kotlin 特有的類別詳細資訊。
> 中繼資料與實際 `.class` 檔案之間任何不一致都可能導致使用反射時出現不正確的行為。
>
{style="warning"}

您也可以使用 Kotlin Metadata JVM 函式庫來檢查各種宣告屬性，例如可見性或模組性，或者產生中繼資料並將其嵌入 `.class` 檔案中。

## 將函式庫加入您的專案

若要將 Kotlin Metadata JVM 函式庫加入您的專案，請根據您的建構工具新增對應的依賴配置。

> Kotlin Metadata JVM 函式庫遵循與 Kotlin 編譯器和標準函式庫相同的版本控制。
> 請確保您使用的版本與您專案的 Kotlin 版本相符。
>
{style="note"}

### Gradle

將以下依賴項加入您的 `build.gradle(.kts)` 檔案：

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

將以下依賴項加入您的 `pom.xml` 檔案。

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

## 讀取和解析中繼資料

`kotlin-metadata-jvm` 函式庫從已編譯的 Kotlin `.class` 檔案中提取結構化資訊，例如類別名稱、可見性和簽章。您可以在需要分析已編譯 Kotlin 宣告的專案中使用它。例如，[二進位相容性驗證器 (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依賴於 `kotlin-metadata-jvm` 來列印公開 API 宣告。

您可以透過使用反射從已編譯的類別中檢索 `@Metadata` 註解來開始探索 Kotlin 類別中繼資料：

```kotlin
fun main() {
    // 指定類別的完整限定名稱
    val clazz = Class.forName("org.example.SampleClass")

    // 檢索 @Metadata 註解
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 檢查中繼資料是否存在
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

檢索 `@Metadata` 註解後，使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函數來解析它。這些函數提取有關類別或檔案的詳細資訊，同時處理不同的相容性要求：

*   `readLenient()`：使用此函數讀取中繼資料，包括由較新 Kotlin 編譯器版本產生的中繼資料。此函數不支援修改或寫入中繼資料。
*   `readStrict()`：當您需要修改和寫入中繼資料時使用此函數。`readStrict()` 函數僅適用於由專案完全支援的 Kotlin 編譯器版本所產生的中繼資料。

    > `readStrict()` 函數支援的中繼資料格式最多可超出 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 一個版本，該版本對應於專案中使用的最新 Kotlin 版本。
    > 例如，如果您的專案依賴於 `kotlin-metadata-jvm:2.1.0`，`readStrict()` 可以處理 Kotlin `2.2.x` 之前的中繼資料；否則，它會拋出錯誤以防止處理未知格式不當。
    >
    > 如需更多資訊，請參閱 [Kotlin Metadata GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)。
    >
    {style="note"}

解析中繼資料時，`KotlinClassMetadata` 實例會提供有關類別或檔案層級宣告的結構化資訊。對於類別，請使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 屬性來分析詳細的類別層級中繼資料，例如類別名稱、函數、屬性以及可見性等屬性。對於檔案層級宣告，中繼資料由 `kmPackage` 屬性表示，其中包含 Kotlin 編譯器產生之檔案門面中的頂層函數和屬性。

以下程式碼範例演示如何使用 `readLenient()` 解析中繼資料，使用 `kmClass` 分析類別層級詳細資訊，以及使用 `kmPackage` 檢索檔案層級宣告：

```kotlin
// 匯入必要的函式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完整限定的類別名稱
    val className = "org.example.SampleClass"

    try {
        // 檢索指定名稱的類別物件
        val clazz = Class.forName(className)

        // 檢索 @Metadata 註解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readLenient() 函數解析中繼資料
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // 迭代函數並檢查可見性
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 迭代函數並檢查可見性
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

### 在中繼資料中寫入和讀取註解
<primary-label ref="experimental-general"/>

您可以將註解儲存在 Kotlin 中繼資料中，並使用 `kotlin-metadata-jvm` 函式庫來存取它們。這消除了透過簽章匹配註解的需求，使多載宣告的存取更加可靠。

若要使註解在您編譯檔案的中繼資料中可用，請新增以下編譯器選項：

```kotlin
-Xannotations-in-metadata
```

或者，將其加入您的 Gradle 建構檔案的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

啟用此選項後，Kotlin 編譯器會將註解寫入中繼資料以及 JVM 位元碼中，使 `kotlin-metadata-jvm` 函式庫可以存取它們。

該函式庫提供了以下用於存取註解的 API：

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

這些 API 為 [實驗性](components-stability.md#stability-levels-explained)。若要啟用，請使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 註解。

以下是從 Kotlin 中繼資料讀取註解的範例：

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

> 如果您在專案中使用 `kotlin-metadata-jvm` 函式庫，我們建議更新並測試您的程式碼以支援註解。
> 否則，當中繼資料中的註解在未來的 Kotlin 版本中[預設啟用](https://youtrack.jetbrains.com/issue/KT-75736)時，
> 您的專案可能會產生無效或不完整的中繼資料。
>
> 如果您遇到任何問題，請在我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-31857)中回報。
>
{style="warning"}

### 從位元碼中提取中繼資料

儘管您可以使用反射檢索中繼資料，但另一種方法是使用 [ASM](https://asm.ow2.io/) 等位元碼操作框架從位元碼中提取中繼資料。

您可以按照以下步驟操作：

1.  使用 ASM 函式庫的 `ClassReader` 類別讀取 `.class` 檔案的位元碼。
    此類別處理已編譯的檔案並填充 `ClassNode` 物件，該物件表示類別結構。
2.  從 `ClassNode` 物件中提取 `@Metadata`。下面的範例為此使用了自訂擴展函數 `findAnnotation()`。
3.  使用 `KotlinClassMetadata.readLenient()` 函數解析提取的中繼資料。
4.  使用 `kmClass` 和 `kmPackage` 屬性檢查已解析的中繼資料。

以下是範例：

```kotlin
// 匯入必要的函式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 檢查註解是否指向特定名稱
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 按鍵檢索註解值
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// 定義一個自訂擴展函數，用於在 ClassNode 中按名稱定位註解
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 簡化檢索註解值的運算子
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 從類別節點中提取 Kotlin 中繼資料
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

// 將檔案轉換為 ClassNode 以供位元碼檢查
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 讀取位元碼並將其處理為 ClassNode 物件
    val classNode = classFile.toClassNode()

    // 定位 @Metadata 註解並寬鬆讀取它
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 檢查已解析的中繼資料
        val kmClass = metadata.kmClass

        // 列印類別詳細資訊
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 修改中繼資料

當使用 [ProGuard](https://github.com/Guardsquare/proguard) 等工具縮小和最佳化位元碼時，某些宣告可能會從 `.class` 檔案中移除。ProGuard 會自動更新中繼資料以使其與修改後的位元碼保持一致。

然而，如果您正在開發一個以類似方式修改 Kotlin 位元碼的自訂工具，則需要確保中繼資料也相應地進行調整。透過 `kotlin-metadata-jvm` 函式庫，您可以更新宣告、調整屬性並移除特定元素。

例如，如果您使用一個刪除 Java 類別檔案中私有方法的 JVM 工具，您也必須從 Kotlin 中繼資料中刪除私有函數以維持一致性：

1.  透過使用 `readStrict()` 函數將 `@Metadata` 註解載入到結構化的 `KotlinClassMetadata` 物件中來解析中繼資料。
2.  透過直接在 `kmClass` 或其他中繼資料結構內調整中繼資料來應用修改，例如篩選函數或更改屬性。
3.  使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函數將修改後的中繼資料編碼成新的 `@Metadata` 註解。

以下是一個從類別中繼資料中移除私有函數的範例：

```kotlin
// 匯入必要的函式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完整限定的類別名稱
    val className = "org.example.SampleClass"

    try {
        // 檢索指定名稱的類別物件
        val clazz = Class.forName(className)

        // 檢索 @Metadata 註解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readStrict() 函數解析中繼資料
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 從類別中繼資料中移除私有函數
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // 序列化修改後的中繼資料
                val newMetadata = metadata.write()
                // 修改中繼資料後，您需要將其寫入類別檔案中
                // 為此，您可以使用位元碼操作框架，例如 ASM
                
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

> 您可以使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函數，而非單獨呼叫 `readStrict()` 和 `write()`。
> 此函數解析中繼資料，透過 lambda 應用轉換，並自動寫入修改後的中繼資料。
>
{style="tip"}

## 從頭開始建立中繼資料

若要使用 Kotlin Metadata JVM 函式庫從頭開始為 Kotlin 類別檔案建立中繼資料：

1.  建立 `KmClass`、`KmPackage` 或 `KmLambda` 實例，具體取決於您要產生的中繼資料類型。
2.  為該實例新增屬性，例如類別名稱、可見性、建構函數和函數簽章。

    > 您可以使用 `apply()` [作用域函數](scope-functions.md)來減少樣板程式碼，同時設定屬性。
    >
    {style="tip"}

3.  使用該實例建立 `KotlinClassMetadata` 物件，該物件可以產生 `@Metadata` 註解。
4.  指定中繼資料版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，並設定旗標（`0` 表示無旗標，或必要時從現有檔案複製旗標）。
5.  使用 [ASM](https://asm.ow2.io/) 中的 `ClassWriter` 類別將中繼資料欄位，例如 `kind`、`data1` 和 `data2` 嵌入到 `.class` 檔案中。

以下範例演示如何為一個簡單的 Kotlin 類別建立中繼資料：

```kotlin
// 匯入必要的函式庫
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // 建立 KmClass 實例
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

    // 將 KotlinClassMetadata.Class 實例（包括版本和旗標）序列化為 @kotlin.Metadata 註解
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // 使用 ASM 產生 .class 檔案
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // 將 @kotlin.Metadata 實例寫入 .class 檔案
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

    // 將產生的 .class 檔案寫入磁碟
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

> 如需更詳細的範例，請參閱 [Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。
>
{style="tip"}

## 下一步

*   [查看 Kotlin Metadata JVM 函式庫的 API 參考](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
*   [查看 Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
*   [了解模組中繼資料以及如何處理 `.kotlin_module` 檔案](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。