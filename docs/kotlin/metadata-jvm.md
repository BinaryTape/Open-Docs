[//]: # (title: Kotlin Metadata JVM 库)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 库提供了用于读取、修改和生成针对 JVM 编译的 Kotlin 类元数据的工具。
这些元数据存储在 `.class` 文件中的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 注解中，
被 [`kotlin-reflect`](reflection.md) 等库和工具用于在运行时检查属性、函数和类等 Kotlin 特有的构造。

> `kotlin-reflect` 库在运行时依赖元数据来检索 Kotlin 特有的类详情。
> 元数据与实际 `.class` 文件之间的任何不一致都可能导致在使用反射时出现错误行为。
> 
{style="warning"}

您还可以使用 Kotlin Metadata JVM 库来检查各种声明属性（如可见性或 modality），或者生成元数据并将其嵌入到 `.class` 文件中。

## 在项目中添加库

要在项目中包含 Kotlin Metadata JVM 库，请根据您的构建工具添加相应的依赖项配置。

> Kotlin Metadata JVM 库遵循与 Kotlin 编译器和标准库相同的版本控制。
> 请确保您使用的版本与项目的 Kotlin 版本相匹配。
> 
{style="note"}

### Gradle

将以下依赖项添加到您的 `build.gradle(.kts)` 文件中：

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

将以下依赖项添加到您的 `pom.xml` 文件中。

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

## 读取并解析元数据

`kotlin-metadata-jvm` 库从编译后的 Kotlin `.class` 文件中提取结构化信息，例如类名、可见性和签名。
您可以将其用于需要分析编译后的 Kotlin 声明的项目。
例如，[二进制兼容性验证器 (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依赖 `kotlin-metadata-jvm` 来打印公共 API 声明。

您可以通过反射从编译后的类中检索 `@Metadata` 注解，开始探索 Kotlin 类元数据：

```kotlin
fun main() {
    // 指定类的完全限定名
    val clazz = Class.forName("org.example.SampleClass")

    // 检索 @Metadata 注解
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 检查元数据是否存在
    if (metadata != null) {
        println("这是一个带有元数据的 Kotlin 类。")
    } else {
        println("这不是一个 Kotlin 类。")
    }
}
```

检索到 `@Metadata` 注解后，使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函数进行解析。
这些函数在提取有关类或文件的详细信息的同时，还能满足不同的兼容性要求：

* `readLenient()`：使用此函数读取元数据，包括由较新 Kotlin 编译器版本生成的元数据。此函数不支持修改或写入元数据。
* `readStrict()`：当您需要修改和写入元数据时，请使用此函数。`readStrict()` 函数仅适用于由项目完全支持的 Kotlin 编译器版本生成的元数据。

    > `readStrict()` 函数支持的元数据格式最高可比 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html)（对应于项目中使用的最新 Kotlin 版本）高出一个版本。
    > 例如，如果您的项目依赖于 `kotlin-metadata-jvm:2.1.0`，则 `readStrict()` 可以处理最高为 Kotlin `2.2.x` 的元数据；否则，它会抛出错误以防止误处理未知格式。
    > 
    > 欲了解更多信息，请参阅 [Kotlin Metadata GitHub 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)。
    >
    {style="note"}

解析元数据时，`KotlinClassMetadata` 实例提供了关于类或文件级声明的结构化信息。
对于类，使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 属性来分析详细的类级元数据，如类名、函数、属性以及可见性等特性。
对于文件级声明，元数据由 `kmPackage` 属性表示，其中包括来自 Kotlin 编译器生成的文件门面（file facades）中的顶级函数和属性。

以下代码示例演示了如何使用 `readLenient()` 解析元数据，使用 `kmClass` 分析类级详情，并使用 `kmPackage` 检索文件级声明：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完全限定类名
    val className = "org.example.SampleClass"

    try {
        // 检索指定名称的类对象
        val clazz = Class.forName(className)

        // 检索 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("找到类的 Kotlin 元数据：$className")

            // 使用 readLenient() 函数解析元数据
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("类名：${kmClass.name}")

                    // 遍历函数并检查可见性
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("函数：${function.name}, 可见性：$visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 遍历函数并检查可见性
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("函数：${function.name}, 可见性：$visibility")
                    }
                }
                else -> {
                    println("不支持的元数据类型：$metadata")
                }
            }
        } else {
            println("未找到类的 Kotlin 元数据：$className")
        }
    } catch (e: ClassNotFoundException) {
        println("未找到类：$className")
    } catch (e: Exception) {
        println("处理元数据时出错：${e.message}")
        e.printStackTrace()
    }
}
```

### 在元数据中写入和读取注解
<primary-label ref="experimental-general"/>

您可以在 Kotlin 元数据中存储注解，并使用 `kotlin-metadata-jvm` 库访问它们。
这消除了通过签名匹配注解的需求，使得对重载声明的访问更加可靠。

要使注解在编译文件的元数据中可用，请添加以下编译器选项：

```kotlin
-Xannotations-in-metadata
```

或者，将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

启用此选项后，Kotlin 编译器会将注解与 JVM 字节码一起写入元数据，从而使它们可供 `kotlin-metadata-jvm` 库访问。

该库提供了以下用于访问注解的 API：

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

这些 API 目前处于[实验性阶段](components-stability.md#stability-levels-explained)。
要启用它们，请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解。

这是一个从 Kotlin 元数据中读取注解的示例：

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

> 如果您在项目中使用 `kotlin-metadata-jvm` 库，我们建议更新并测试您的代码以支持注解。
> 否则，当注解在元数据中在未来的 Kotlin 版本中变为[默认启用](https://youtrack.jetbrains.com/issue/KT-75736)时，
> 您的项目可能会生成无效或不完整的元数据。
>
> 如果您遇到任何问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-31857)中报告。
>
{style="warning"}

### 从字节码中提取元数据

虽然您可以使用反射来检索元数据，但另一种方法是使用字节码操作框架（如 [ASM](https://asm.ow2.io/)）从字节码中提取它。

您可以按照以下步骤操作：

1. 使用 ASM 库的 `ClassReader` 类读取 `.class` 文件的字节码。该类会处理编译后的文件并填充一个 `ClassNode` 对象，该对象代表类结构。
2. 从 `ClassNode` 对象中提取 `@Metadata`。下面的示例使用了一个自定义扩展函数 `findAnnotation()` 来完成此操作。
3. 使用 `KotlinClassMetadata.readLenient()` 函数解析提取的元数据。
4. 通过 `kmClass` 和 `kmPackage` 属性检查解析后的元数据。

示例如下：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 检查注解是否引用特定名称
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 按键检索注解值
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// 定义一个自定义扩展函数，以便在 ClassNode 中通过名称定位注解
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 简化检索注解值的运算符
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 从类节点中以宽松模式读取 Kotlin 元数据
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

// 将文件转换为 ClassNode 以进行字节码检查
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 读取字节码并将其处理为 ClassNode 对象
    val classNode = classFile.toClassNode()

    // 定位 @Metadata 注解并以宽松模式读取
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 检查解析后的元数据
        val kmClass = metadata.kmClass

        // 打印类详情
        println("类名：${kmClass.name}")
        println("函数：")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, 可见性：${function.visibility}")
        }
    }
}
```

## 修改元数据

当使用 [ProGuard](https://github.com/Guardsquare/proguard) 等工具来缩减和优化字节码时，某些声明可能会从 `.class` 文件中移除。ProGuard 会自动更新元数据以保持其与修改后的字节码一致。

但是，如果您正在开发一个以类似方式修改 Kotlin 字节码的自定义工具，则需要确保元数据也进行了相应调整。使用 `kotlin-metadata-jvm` 库，您可以更新声明、调整属性并移除特定元素。

例如，如果您使用一个 JVM 工具从 Java 类文件中删除私有方法，您还必须从 Kotlin 元数据中删除私有函数以保持一致性：

1. 通过使用 `readStrict()` 函数将 `@Metadata` 注解加载到结构化的 `KotlinClassMetadata` 对象中来解析元数据。
2. 通过直接在 `kmClass` 或其他元数据结构中调整元数据（例如过滤函数或更改属性）来应用修改。
3. 使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函数将修改后的元数据编码为新的 `@Metadata` 注解。

以下是一个从类的元数据中移除私有函数的示例：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完全限定类名
    val className = "org.example.SampleClass"

    try {
        // 检索指定名称的类对象
        val clazz = Class.forName(className)

        // 检索 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("找到类的 Kotlin 元数据：$className")

            // 使用 readStrict() 函数解析元数据
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 从类元数据中移除私有函数
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("已移除私有函数。剩余函数：${kmClass.functions.map { it.name }}")

                // 将修改后的元数据重新序列化
                val newMetadata = metadata.write()
                // 修改元数据后，您需要将其写入类文件
                // 为此，您可以使用 ASM 等字节码操作框架
                
                println("修改后的元数据：${newMetadata}")
            } else {
                println("该元数据不是一个类。")
            }
        } else {
            println("未找到类的 Kotlin 元数据：$className")
        }
    } catch (e: ClassNotFoundException) {
        println("未找到类：$className")
    } catch (e: Exception) {
        println("处理元数据时出错：${e.message}")
        e.printStackTrace()
    }
}
```

> 除了分别调用 `readStrict()` 和 `write()`，您还可以使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函数。
> 该函数会解析元数据，通过 lambda 应用转换，并自动写入修改后的元数据。
> 
{style="tip"}

## 从零开始创建元数据

要使用 Kotlin Metadata JVM 库从零开始为 Kotlin 类文件创建元数据：

1. 根据您要生成的元数据类型，创建一个 `KmClass`、`KmPackage` 或 `KmLambda` 实例。
2. 为实例添加属性，例如类名、可见性、构造函数和函数签名。

    > 您可以使用 `apply()` [作用域函数](scope-functions.md) 在设置属性时减少模板代码。
    >
    {style="tip"}

3. 使用该实例创建一个 `KotlinClassMetadata` 对象，该对象可以生成 `@Metadata` 注解。
4. 指定元数据版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，并设置标志（`0` 表示无标志，或在必要时从现有文件复制标志）。
5. 使用来自 [ASM](https://asm.ow2.io/) 的 `ClassWriter` 类将元数据字段（如 `kind`、`data1` 和 `data2`）嵌入到 `.class` 文件中。

以下示例演示了如何为一个简单的 Kotlin 类创建元数据：

```kotlin
// 导入必要的库
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // 创建 KmClass 实例
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

    // 将 KotlinClassMetadata.Class 实例（包括版本和标志）序列化为 @kotlin.Metadata 注解
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // 使用 ASM 生成 .class 文件
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // 将 @kotlin.Metadata 实例写入 .class 文件
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

    // 将生成的 .class 文件写入磁盘
    java.io.File("Hello.class").writeBytes(classBytes)

    println("元数据和 .class 文件创建成功。")
}
```

> 有关更详细的示例，请参阅 [Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。
> 
{style="tip"}

## 下一步

* [查看 Kotlin Metadata JVM 库的 API 参考](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [访问 Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [了解模块元数据以及如何使用 `.kotlin_module` 文件](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。