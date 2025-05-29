[//]: # (title: Kotlin 元数据 JVM 库)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 库提供了从针对 JVM 编译的 Kotlin 类中读取、修改和生成元数据的工具。
此元数据存储在 `.class` 文件中的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 注解内，
被 [`kotlin-reflect`](reflection.md) 等库和工具用于在运行时检查 Kotlin 特有的构造，例如属性、函数和类。

> `kotlin-reflect` 库依赖元数据在运行时检索 Kotlin 特有的类详细信息。
> 元数据与实际 `.class` 文件之间的任何不一致在使用反射时可能导致不正确的行为。
>
{style="warning"}

您还可以使用 Kotlin 元数据 JVM 库来检查各种声明属性，例如可见性或修饰符 (modality)，或者生成并将元数据嵌入到 `.class` 文件中。

## 将库添加到您的项目

要将 Kotlin 元数据 JVM 库包含到您的项目中，请根据您的构建工具添加相应的依赖配置。

> Kotlin 元数据 JVM 库遵循与 Kotlin 编译器和标准库相同的版本控制。
> 确保您使用的版本与您项目的 Kotlin 版本匹配。
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

## 读取和解析元数据

`kotlin-metadata-jvm` 库从编译后的 Kotlin `.class` 文件中提取结构化信息，例如类名、可见性和签名。
您可以在需要分析编译后的 Kotlin 声明的项目中使用它。
例如，[Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依赖 `kotlin-metadata-jvm` 来打印公共 API 声明。

您可以通过使用反射从编译后的类中检索 `@Metadata` 注解来开始探索 Kotlin 类元数据：

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

检索到 `@Metadata` 注解后，使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函数来解析它。
这些函数提取关于类或文件的详细信息，同时满足不同的兼容性要求：

*   `readLenient()`：使用此函数读取元数据，包括由较新 Kotlin 编译器版本生成的元数据。此函数不支持修改或写入元数据。
*   `readStrict()`：当您需要修改和写入元数据时使用此函数。`readStrict()` 函数仅适用于由您的项目完全支持的 Kotlin 编译器版本生成的元数据。

    > `readStrict()` 函数支持元数据格式，最高可超出 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 一个版本，这对应于项目中使用的最新 Kotlin 版本。
    > 例如，如果您的项目依赖 `kotlin-metadata-jvm:2.1.0`，`readStrict()` 可以处理高达 Kotlin `2.2.x` 的元数据；否则，它会抛出错误以防止误处理未知格式。
    >
    > 更多信息，请参阅 [Kotlin Metadata GitHub 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)。
    >
    {style="note"}

解析元数据时，`KotlinClassMetadata` 实例提供关于类或文件级声明的结构化信息。
对于类，使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 属性来分析详细的类级别元数据，例如类名、函数、属性以及可见性等属性。
对于文件级声明，元数据由 `kmPackage` 属性表示，它包含 Kotlin 编译器生成的文件外观（file facades）中的顶级函数和属性。

以下代码示例演示了如何使用 `readLenient()` 解析元数据，使用 `kmClass` 分析类级别详细信息，并使用 `kmPackage` 检索文件级声明：

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

### 从字节码中提取元数据

虽然可以使用反射检索元数据，但另一种方法是使用字节码操作框架（例如 [ASM](https://asm.ow2.io/)）从字节码中提取它。

您可以通过以下步骤完成此操作：

1.  使用 ASM 库的 `ClassReader` 类读取 `.class` 文件的字节码。
    此此类处理编译后的文件并填充一个 `ClassNode` 对象，它表示类结构。
2.  从 `ClassNode` 对象中提取 `@Metadata`。下面的示例为此使用了自定义扩展函数 `findAnnotation()`。
3.  使用 `KotlinClassMetadata.readLenient()` 函数解析提取的元数据。
4.  使用 `kmClass` 和 `kmPackage` 属性检查解析后的元数据。

以下是一个示例：

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

## 修改元数据

当使用像 [ProGuard](https://github.com/Guardsquare/proguard) 这样的工具来收缩和优化字节码时，某些声明可能会从 `.class` 文件中删除。
ProGuard 会自动更新元数据，使其与修改后的字节码保持一致。

然而，如果您正在开发一个以类似方式修改 Kotlin 字节码的自定义工具，您需要确保元数据得到相应调整。
使用 `kotlin-metadata-jvm` 库，您可以更新声明、调整属性并删除特定元素。

例如，如果您使用一个从 Java 类文件中删除私有方法的 JVM 工具，您还必须从 Kotlin 元数据中删除私有函数以保持一致性：

1.  通过使用 `readStrict()` 函数解析元数据，将 `@Metadata` 注解加载到结构化的 `KotlinClassMetadata` 对象中。
2.  通过调整元数据来应用修改，例如过滤函数或更改属性，直接在 `kmClass` 或其他元数据结构中进行。
3.  使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函数将修改后的元数据编码为新的 `@Metadata` 注解。

以下示例演示了如何从类的元数据中删除私有函数：

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

> 您可以不单独调用 `readStrict()` 和 `write()`，而是使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函数。
> 此函数解析元数据，通过 lambda 应用转换，并自动写入修改后的元数据。
>
{style="tip"}

## 从头开始创建元数据

要使用 Kotlin 元数据 JVM 库从头开始为一个 Kotlin 类文件创建元数据：

1.  创建一个 `KmClass`、`KmPackage` 或 `KmLambda` 实例，具体取决于您要生成的元数据类型。
2.  向实例添加属性，例如类名、可见性、构造函数和函数签名。

    > 您可以使用 `apply()` [作用域函数](scope-functions.md) 在设置属性时减少样板代码。
    >
    {style="tip"}

3.  使用该实例创建一个 `KotlinClassMetadata` 对象，它可以生成一个 `@Metadata` 注解。
4.  指定元数据版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，并设置标志（`0` 表示无标志，或在必要时从现有文件中复制标志）。
5.  使用 [ASM](https://asm.ow2.io/) 的 `ClassWriter` 类将元数据字段（例如 `kind`、`data1` 和 `data2`）嵌入到 `.class` 文件中。

以下示例演示了如何为一个简单的 Kotlin 类创建元数据：

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

> 有关更详细的示例，请参阅 [Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。
>
{style="tip"}

## 下一步

*   [查看 Kotlin Metadata JVM 库的 API 参考](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
*   [查看 Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
*   [了解模块元数据以及如何使用 `.kotlin_module` 文件](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)。