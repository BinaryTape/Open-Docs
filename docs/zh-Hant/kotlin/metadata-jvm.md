[//]: # (title: Kotlin Metadata JVM 程式庫)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 程式庫提供了一些工具，用於讀取、修改和從為 JVM 編譯的 Kotlin 類別中產生 metadata。
這些 metadata 儲存在 `.class` 檔案中的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 註解內，
供 [`kotlin-reflect`](reflection.md) 等程式庫和工具使用，以便在執行階段檢查屬性、函式和類別等 Kotlin 特有的建構。

> `kotlin-reflect` 程式庫依賴 metadata 在執行階段檢索 Kotlin 特有的類別細節。
> metadata 與實際 `.class` 檔案之間的任何不一致，都可能導致在使用反射時產生錯誤的行為。
> 
{style="warning"}

您還可以使用 Kotlin Metadata JVM 程式庫來檢查各種宣告屬性，例如可見性或修飾語 (modality)，或產生 metadata 並將其嵌入到 `.class` 檔案中。

## 將程式庫加入您的專案

若要在專案中包含 Kotlin Metadata JVM 程式庫，請根據您的建置工具加入對應的相依性組態。

> Kotlin Metadata JVM 程式庫遵循與 Kotlin 編譯器和標準函式庫相同的版本控制。
> 請確保您使用的版本與專案的 Kotlin 版本相符。
> 
{style="note"}

### Gradle

將以下相依性加入您的 `build.gradle(.kts)` 檔案：

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

將以下相依性加入您的 `pom.xml` 檔案。

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

## 讀取與剖析 metadata

`kotlin-metadata-jvm` 程式庫從編譯後的 Kotlin `.class` 檔案中擷取結構化資訊，例如類別名稱、可見性和簽章。
您可以在需要分析編譯後 Kotlin 宣告的專案中使用它。
例如，[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依賴 `kotlin-metadata-jvm` 來列印公開 API 宣告。

您可以透過反射從編譯後的類別中檢索 `@Metadata` 註解，開始探索 Kotlin 類別 metadata：

```kotlin
fun main() {
    // 指定類別的完全限定名稱
    val clazz = Class.forName("org.example.SampleClass")

    // 檢索 @Metadata 註解
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 檢查 metadata 是否存在
    if (metadata != null) {
        println("這是一個帶有 metadata 的 Kotlin 類別。")
    } else {
        println("這不是一個 Kotlin 類別。")
    }
}
```

檢索到 `@Metadata` 註解後，請使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函式來進行剖析。
這些函式會擷取有關類別或檔案的詳細資訊，同時滿足不同的相容性需求：

* `readLenient()`：使用此函式讀取 metadata，包括由較新版本的 Kotlin 編譯器產生的 metadata。此函式不支援修改或寫入 metadata。
* `readStrict()`：當您需要修改並寫入 metadata 時，請使用此函式。`readStrict()` 函式僅適用於專案完全支援的 Kotlin 編譯器版本所產生的 metadata。

    > `readStrict()` 函式支援的 metadata 格式最高可達 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 之後的一個版本，這對應於專案中使用的最新 Kotlin 版本。
    > 例如，如果您的專案相依於 `kotlin-metadata-jvm:2.1.0`，則 `readStrict()` 最高可處理 Kotlin `2.2.x` 的 metadata；否則，它會拋出錯誤以防止錯誤處理未知的格式。
    > 
    > 若要了解更多資訊，請參閱 [Kotlin Metadata GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)。 
    >
    {style="note"}

剖析 metadata 時，`KotlinClassMetadata` 執行個體會提供有關類別或檔案層級宣告的結構化資訊。
對於類別，請使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 屬性來分析詳細的類別層級 metadata，例如類別名稱、函式、屬性以及可見性等屬性。
對於檔案層級的宣告，metadata 由 `kmPackage` 屬性表示，其中包含來自 Kotlin 編譯器產生的檔案外觀 (file facades) 的頂層函式和屬性。

以下程式碼範例示範如何使用 `readLenient()` 剖析 metadata、使用 `kmClass` 分析類別層級細節，以及使用 `kmPackage` 檢索檔案層級宣告：

```kotlin
// 匯入必要的程式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定類別的完全限定名稱
    val className = "org.example.SampleClass"

    try {
        // 檢索指定名稱的類別物件
        val clazz = Class.forName(className)

        // 檢索 @Metadata 註解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("找到類別的 Kotlin Metadata：$className")

            // 使用 readLenient() 函式剖析 metadata
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("類別名稱：${kmClass.name}")

                    // 疊代函式並檢查可見性
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("函式：${function.name}, 可見性：$visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 疊代函式並檢查可見性
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("函式：${function.name}, 可見性：$visibility")
                    }
                }
                else -> {
                    println("不支援的 metadata 類型：$metadata")
                }
            }
        } else {
            println("未找到類別的 Kotlin Metadata：$className")
        }
    } catch (e: ClassNotFoundException) {
        println("找不到類別：$className")
    } catch (e: Exception) {
        println("處理 metadata 時發生錯誤：${e.message}")
        e.printStackTrace()
    }
}
```

### 在 metadata 中寫入與讀取註解

Kotlin 將註解同時儲存在位元組碼與 Kotlin metadata 中。如果您使用 `kotlin-metadata-jvm` 程式庫來讀取或寫入註解，您將處理它們在 metadata 中的表示形式。

> Kotlin 從 2.4.0 版本開始將註解儲存在 Kotlin metadata 中。如果您檢查使用較早版本編譯的類別檔案，metadata 中將不存在註解。
>
{style="note"}

當您變更 metadata 中的註解時，請確保它們與儲存在位元組碼中的註解保持一致。如果它們失去同步，依賴反射或位元組碼分析的工具可能會報告與讀取 Kotlin metadata 的工具不同的結果。

`kotlin-metadata-jvm` 程式庫提供以下用於存取註解的 API：

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

以下是從 Kotlin metadata 讀取註解的範例：

```kotlin
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

### 從位元組碼中擷取 metadata

雖然您可以使用反射檢索 metadata，但另一種方法是使用 [ASM](https://asm.ow2.io/) 等位元組碼操作框架從位元組碼中擷取它。

您可以按照以下步驟執行此操作：

1. 使用 ASM 程式庫的 `ClassReader` 類別讀取 `.class` 檔案的位元組碼。
   此類別會處理編譯後的檔案並填充一個 `ClassNode` 物件，該物件代表類別結構。
2. 從 `ClassNode` 物件中擷取 `@Metadata`。下面的範例使用自訂擴充函式 `findAnnotation()` 來完成此操作。
3. 使用 `KotlinClassMetadata.readLenient()` 函式剖析擷取出的 metadata。
4. 使用 `kmClass` 和 `kmPackage` 屬性檢查剖析後的 metadata。

這是一個範例：

```kotlin
// 匯入必要的程式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 檢查註解是否引用了特定名稱
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 透過鍵檢索註解值
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// 定義自訂擴充函式，透過名稱在 ClassNode 中尋找註解
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 用於簡化檢索註解值的運算子
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 從類別節點中擷取 Kotlin metadata
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

// 將檔案轉換為 ClassNode 以進行位元組碼檢查
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 讀取位元組碼並將其處理為 ClassNode 物件
    val classNode = classFile.toClassNode()

    // 定位 @Metadata 註解並寬鬆地讀取
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 檢查剖析後的 metadata
        val kmClass = metadata.kmClass

        // 列印類別詳情
        println("類別名稱：${kmClass.name}")
        println("函式：")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, 可見性：${function.visibility}")
        }
    }
}
```

## 修改 metadata

當使用 [ProGuard](https://github.com/Guardsquare/proguard) 等工具來縮減和優化位元組碼時，某些宣告可能會從 `.class` 檔案中移除。
ProGuard 會自動更新 metadata，使其與修改後的位元組碼保持一致。

然而，如果您正在開發一個以類似方式修改 Kotlin 位元組碼的自訂工具，則需要確保 metadata 也進行相應的調整。
藉助 `kotlin-metadata-jvm` 程式庫，您可以更新宣告、調整屬性以及移除特定元素。

例如，如果您使用一個從 Java 類別檔案中刪除私有方法的 JVM 工具，您也必須從 Kotlin metadata 中刪除私有函式以保持一致性：

1. 使用 `readStrict()` 函式將 `@Metadata` 註解載入到結構化的 `KotlinClassMetadata` 物件中來剖析 metadata。
2. 透過直接在 `kmClass` 或其他 metadata 結構中調整 metadata（例如過濾函式或更改屬性）來套用修改。
3. 使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函式將修改後的 metadata 編碼到新的 `@Metadata` 註解中。

以下是從類別的 metadata 中移除私有函式的範例：

```kotlin
// 匯入必要的程式庫
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定類別的完全限定名稱
    val className = "org.example.SampleClass"

    try {
        // 檢索指定名稱的類別物件
        val clazz = Class.forName(className)

        // 檢索 @Metadata 註解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("找到類別的 Kotlin Metadata：$className")

            // 使用 readStrict() 函式剖析 metadata
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 從類別 metadata 中移除私有函式
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("已移除私有函式。剩餘函式：${kmClass.functions.map { it.name }}")

                // 將修改後的 metadata 重新序列化
                val newMetadata = metadata.write()
                // 修改 metadata 後，您需要將其寫入類別檔案中
                // 為此，您可以使用 ASM 等位元組碼操作框架
                
                println("修改後的 metadata：${newMetadata}")
            } else {
                println("該 metadata 不是類別。")
            }
        } else {
            println("未找到類別的 Kotlin Metadata：$className")
        }
    } catch (e: ClassNotFoundException) {
        println("找不到類別：$className")
    } catch (e: Exception) {
        println("處理 metadata 時發生錯誤：${e.message}")
        e.printStackTrace()
    }
}
```

> 您可以使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函式，而不是分別呼叫 `readStrict()` 和 `write()`。
> 此函式會剖析 metadata，透過 Lambda 套用轉換，並自動寫入修改後的 metadata。
> 
{style="tip"}

## 從頭開始建立 metadata

若要使用 Kotlin Metadata JVM 程式庫從頭開始為 Kotlin 類別檔案建立 metadata：

1. 根據您要產生的 metadata 類型，建立 `KmClass`、`KmPackage` 或 `KmLambda` 的執行個體。
2. 為該執行個體加入屬性，例如類別名稱、可見性、建構函式和函式簽章。

    > 在設定屬性時，您可以使用 `apply()` [作用域函式](scope-functions.md) 來減少樣板程式碼。
    >
    {style="tip"}

3. 使用該執行個體建立一個 `KotlinClassMetadata` 物件，該物件可以產生 `@Metadata` 註解。
4. 指定 metadata 版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，並設定標記 (flags)（`0` 表示無標記，或必要時從現有檔案複製標記）。
5. 使用來自 [ASM](https://asm.ow2.io/) 的 `ClassWriter` 類別將 metadata 欄位（例如 `kind`、`data1` 和 `data2`）嵌入到 `.class` 檔案中。

以下範例示範如何為一個簡單的 Kotlin 類別建立 metadata：

```kotlin
// 匯入必要的程式庫
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // 建立 KmClass 執行個體
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

    // 將 KotlinClassMetadata.Class 執行個體（包括版本和標記）序列化為 @kotlin.Metadata 註解
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // 使用 ASM 產生 .class 檔案
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // 將 @kotlin.Metadata 執行個體寫入 .class 檔案
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

    println("Metadata 和 .class 檔案已成功建立。")
}
```

> 如需更詳細的範例，請參閱 [Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。
> 
{style="tip"}

## 接續步驟

* [參閱 Kotlin Metadata JVM 程式庫的 API 參考資料](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [查看 Kotlin Metadata JVM GitHub 儲存庫](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [了解模組 metadata 以及如何使用 `.kotlin_module` 檔案](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。