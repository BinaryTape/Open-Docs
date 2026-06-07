[//]: # (title: Kotlin Metadata JVM 라이브러리)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 라이브러리는 JVM용으로 컴파일된 Kotlin 클래스에서 메타데이터를 읽고, 수정하고, 생성하는 도구를 제공합니다.
`.class` 파일 내의 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 어노테이션에 저장되는 이 메타데이터는, [`kotlin-reflect`](reflection.md)와 같은 라이브러리 및 도구에서 런타임에 프로퍼티, 함수, 클래스와 같은 Kotlin 전용 구조를 검사하는 데 사용됩니다.

> `kotlin-reflect` 라이브러리는 런타임에 Kotlin 전용 클래스 상세 정보를 검색하기 위해 메타데이터에 의존합니다.
> 메타데이터와 실제 `.class` 파일 간의 불일치는 리플렉션을 사용할 때 잘못된 동작으로 이어질 수 있습니다.
> 
{style="warning"}

Kotlin Metadata JVM 라이브러리를 사용하여 가시성(visibility)이나 모달리티(modality)와 같은 다양한 선언 속성을 검사하거나, 메타데이터를 생성하여 `.class` 파일에 포함시킬 수도 있습니다.

## 프로젝트에 라이브러리 추가하기

프로젝트에 Kotlin Metadata JVM 라이브러리를 포함하려면 빌드 도구에 따라 해당하는 의존성 설정을 추가하세요.

> Kotlin Metadata JVM 라이브러리는 Kotlin 컴파일러 및 표준 라이브러리와 동일한 버전 관리 체계를 따릅니다.
> 사용하는 버전이 프로젝트의 Kotlin 버전과 일치하는지 확인하세요.
> 
{style="note"}

### Gradle

`build.gradle(.kts)` 파일에 다음 의존성을 추가하세요.

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

`pom.xml` 파일에 다음 의존성을 추가하세요.

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

## 메타데이터 읽기 및 파싱

`kotlin-metadata-jvm` 라이브러리는 컴파일된 Kotlin `.class` 파일에서 클래스 이름, 가시성, 시그니처와 같은 구조화된 정보를 추출합니다.
컴파일된 Kotlin 선언을 분석해야 하는 프로젝트에서 이 라이브러리를 사용할 수 있습니다.
예를 들어, [Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator)는 `kotlin-metadata-jvm`에 의존하여 공개 API 선언을 출력합니다.

리플렉션을 사용하여 컴파일된 클래스에서 `@Metadata` 어노테이션을 가져옴으로써 Kotlin 클래스 메타데이터 탐색을 시작할 수 있습니다.

```kotlin
fun main() {
    // 클래스의 정규화된 이름(fully qualified name)을 지정합니다.
    val clazz = Class.forName("org.example.SampleClass")

    // @Metadata 어노테이션을 가져옵니다.
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 메타데이터가 존재하는지 확인합니다.
    if (metadata != null) {
        println("이것은 메타데이터가 있는 Kotlin 클래스입니다.")
    } else {
        println("이것은 Kotlin 클래스가 아닙니다.")
    }
}
```

`@Metadata` 어노테이션을 가져온 후, [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API의 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 또는 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 함수를 사용하여 이를 파싱합니다.
이 함수들은 서로 다른 호환성 요구 사항을 처리하면서 클래스나 파일에 대한 상세 정보를 추출합니다.

* `readLenient()`: 최신 Kotlin 컴파일러 버전에서 생성된 메타데이터를 포함하여 메타데이터를 읽을 때 이 함수를 사용합니다. 이 함수는 메타데이터의 수정이나 쓰기를 지원하지 않습니다.
* `readStrict()`: 메타데이터를 수정하고 써야 할 때 이 함수를 사용합니다. `readStrict()` 함수는 프로젝트에서 완전히 지원되는 Kotlin 컴파일러 버전으로 생성된 메타데이터에서만 작동합니다.

    > `readStrict()` 함수는 프로젝트에서 사용되는 최신 Kotlin 버전에 해당하는 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html)보다 한 버전 높은 메타데이터 형식까지 지원합니다.
    > 예를 들어, 프로젝트가 `kotlin-metadata-jvm:2.1.0`에 의존하는 경우 `readStrict()`는 Kotlin `2.2.x`까지의 메타데이터를 처리할 수 있습니다. 그 이상의 버전일 경우 알 수 없는 형식을 잘못 처리하는 것을 방지하기 위해 에러를 발생시킵니다.
    > 
    > 자세한 내용은 [Kotlin Metadata GitHub 리포지토리](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)를 참조하세요. 
    >
    {style="note"}

메타데이터를 파싱할 때 `KotlinClassMetadata` 인스턴스는 클래스 또는 파일 레벨 선언에 대한 구조화된 정보를 제공합니다.
클래스의 경우, [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 프로퍼티를 사용하여 클래스 이름, 함수, 프로퍼티, 가시성과 같은 속성 등 상세한 클래스 레벨 메타데이터를 분석합니다.
파일 레벨 선언의 경우, 메타데이터는 `kmPackage` 프로퍼티로 표현되며, 여기에는 Kotlin 컴파일러가 생성한 파일 파사드(file facades)의 최상위 함수 및 프로퍼티가 포함됩니다.

다음 코드 예제는 `readLenient()`를 사용하여 메타데이터를 파싱하고, `kmClass`로 클래스 레벨의 상세 정보를 분석하며, `kmPackage`로 파일 레벨 선언을 가져오는 방법을 보여줍니다.

```kotlin
// 필요한 라이브러리를 임포트합니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 정규화된 클래스 이름을 지정합니다.
    val className = "org.example.SampleClass"

    try {
        // 지정된 이름에 대한 클래스 객체를 가져옵니다.
        val clazz = Class.forName(className)

        // @Metadata 어노테이션을 가져옵니다.
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("클래스에 대한 Kotlin 메타데이터를 찾았습니다: $className")

            // readLenient() 함수를 사용하여 메타데이터를 파싱합니다.
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("클래스 이름: ${kmClass.name}")

                    // 함수를 순회하며 가시성을 확인합니다.
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("함수: ${function.name}, 가시성: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 함수를 순회하며 가시성을 확인합니다.
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("함수: ${function.name}, 가시성: $visibility")
                    }
                }
                else -> {
                    println("지원되지 않는 메타데이터 유형: $metadata")
                }
            }
        } else {
            println("클래스에 대한 Kotlin 메타데이터를 찾을 수 없습니다: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("클래스를 찾을 수 없습니다: $className")
    } catch (e: Exception) {
        println("메타데이터 처리 중 오류 발생: ${e.message}")
        e.printStackTrace()
    }
}
```

### 메타데이터의 어노테이션 쓰기 및 읽기

Kotlin은 바이트코드와 Kotlin 메타데이터 양쪽에 어노테이션을 저장합니다. `kotlin-metadata-jvm` 라이브러리를 사용하여 어노테이션을 읽거나 쓸 때는 어노테이션의 메타데이터 표현을 다루게 됩니다.

> Kotlin은 Kotlin 2.4.0부터 Kotlin 메타데이터에 어노테이션을 저장하기 시작했습니다. 이전 버전으로 컴파일된 클래스 파일을 검사하면 메타데이터에 어노테이션이 존재하지 않습니다.
>
{style="note"}

메타데이터의 어노테이션을 변경할 때는 바이트코드에 저장된 어노테이션과 일관성을 유지하도록 해야 합니다. 두 위치의 데이터가 일치하지 않으면, 리플렉션이나 바이트코드 분석에 의존하는 도구가 Kotlin 메타데이터를 읽는 도구와 다른 결과를 보고할 수 있습니다.

`kotlin-metadata-jvm` 라이브러리는 어노테이션 액세스를 위해 다음 API를 제공합니다.

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

다음은 Kotlin 메타데이터에서 어노테이션을 읽는 예제입니다.

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

### 바이트코드에서 메타데이터 추출하기

리플렉션을 사용하여 메타데이터를 가져올 수도 있지만, [ASM](https://asm.ow2.io/)과 같은 바이트코드 조작 프레임워크를 사용하여 바이트코드에서 직접 추출하는 방법도 있습니다.

다음 단계에 따라 수행할 수 있습니다.

1. ASM 라이브러리의 `ClassReader` 클래스를 사용하여 `.class` 파일의 바이트코드를 읽습니다.
   이 클래스는 컴파일된 파일을 처리하고 클래스 구조를 나타내는 `ClassNode` 객체를 채웁니다.
2. `ClassNode` 객체에서 `@Metadata`를 추출합니다. 아래 예제는 이를 위해 커스텀 확장 함수 `findAnnotation()`을 사용합니다.
3. 추출된 메타데이터를 `KotlinClassMetadata.readLenient()` 함수를 사용하여 파싱합니다.
4. `kmClass` 및 `kmPackage` 프로퍼티를 사용하여 파싱된 메타데이터를 검사합니다.

다음은 예제입니다.

```kotlin
// 필요한 라이브러리를 임포트합니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 어노테이션이 특정 이름을 참조하는지 확인합니다.
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 키로 어노테이션 값을 가져옵니다.
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// ClassNode에서 이름으로 어노테이션을 찾는 커스텀 확장 함수를 정의합니다.
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 어노테이션 값을 간편하게 가져오기 위한 연산자
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 클래스 노드에서 Kotlin 메타데이터를 추출합니다.
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

// 바이트코드 검사를 위해 파일을 ClassNode로 변환합니다.
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 바이트코드를 읽고 ClassNode 객체로 처리합니다.
    val classNode = classFile.toClassNode()

    // @Metadata 어노테이션을 찾아 관용적으로 읽습니다.
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 파싱된 메타데이터를 검사합니다.
        val kmClass = metadata.kmClass

        // 클래스 상세 정보를 출력합니다.
        println("클래스 이름: ${kmClass.name}")
        println("함수 목록:")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, 가시성: ${function.visibility}")
        }
    }
}
```

## 메타데이터 수정하기

바이트코드를 축소하고 최적화하기 위해 [ProGuard](https://github.com/Guardsquare/proguard)와 같은 도구를 사용할 때, 일부 선언이 `.class` 파일에서 제거될 수 있습니다.
ProGuard는 수정된 바이트코드와 일관성을 유지하기 위해 메타데이터를 자동으로 업데이트합니다.

그러나 이와 유사한 방식으로 Kotlin 바이트코드를 수정하는 커스텀 도구를 개발하는 경우, 메타데이터도 그에 맞게 조정해야 합니다.
`kotlin-metadata-jvm` 라이브러리를 사용하면 선언을 업데이트하고, 속성을 조정하고, 특정 요소를 제거할 수 있습니다.

예를 들어, Java 클래스 파일에서 private 메서드를 삭제하는 JVM 도구를 사용하는 경우, 일관성을 유지하기 위해 Kotlin 메타데이터에서도 private 함수를 삭제해야 합니다.

1. `readStrict()` 함수를 사용하여 `@Metadata` 어노테이션을 구조화된 `KotlinClassMetadata` 객체로 로드하여 메타데이터를 파싱합니다.
2. `kmClass` 또는 기타 메타데이터 구조 내에서 직접 함수를 필터링하거나 속성을 변경하여 수정을 적용합니다.
3. [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 함수를 사용하여 수정된 메타데이터를 새로운 `@Metadata` 어노테이션으로 인코딩합니다.

다음은 클래스의 메타데이터에서 private 함수를 제거하는 예제입니다.

```kotlin
// 필요한 라이브러리를 임포트합니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 정규화된 클래스 이름을 지정합니다.
    val className = "org.example.SampleClass"

    try {
        // 지정된 이름에 대한 클래스 객체를 가져옵니다.
        val clazz = Class.forName(className)

        // @Metadata 어노테이션을 가져옵니다.
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("클래스에 대한 Kotlin 메타데이터를 찾았습니다: $className")

            // readStrict() 함수를 사용하여 메타데이터를 파싱합니다.
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 클래스 메타데이터에서 private 함수를 제거합니다.
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("private 함수를 제거했습니다. 남은 함수: ${kmClass.functions.map { it.name }}")

                // 수정된 메타데이터를 다시 직렬화합니다.
                val newMetadata = metadata.write()
                // 메타데이터를 수정한 후에는 이를 클래스 파일에 써야 합니다.
                // 이를 위해 ASM과 같은 바이트코드 조작 프레임워크를 사용할 수 있습니다.
                
                println("수정된 메타데이터: ${newMetadata}")
            } else {
                println("메타데이터가 클래스가 아닙니다.")
            }
        } else {
            println("클래스에 대한 Kotlin 메타데이터를 찾을 수 없습니다: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("클래스를 찾을 수 없습니다: $className")
    } catch (e: Exception) {
        println("메타데이터 처리 중 오류 발생: ${e.message}")
        e.printStackTrace()
    }
}
```

> `readStrict()`와 `write()`를 별도로 호출하는 대신 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 함수를 사용할 수 있습니다.
> 이 함수는 메타데이터를 파싱하고, 람다를 통해 변환을 적용한 후, 수정된 메타데이터를 자동으로 씁니다.
> 
{style="tip"}

## 메타데이터 처음부터 생성하기

Kotlin Metadata JVM 라이브러리를 사용하여 Kotlin 클래스 파일용 메타데이터를 처음부터 생성하려면 다음 단계를 따르세요.

1. 생성하려는 메타데이터 유형에 따라 `KmClass`, `KmPackage` 또는 `KmLambda`의 인스턴스를 생성합니다.
2. 클래스 이름, 가시성, 생성자 및 함수 시그니처와 같은 속성을 인스턴스에 추가합니다.

    > 프로퍼티를 설정할 때 상용구 코드를 줄이기 위해 `apply()` [범위 함수(scope function)](scope-functions.md)를 사용할 수 있습니다.
    >
    {style="tip"}

3. 인스턴스를 사용하여 `@Metadata` 어노테이션을 생성할 수 있는 `KotlinClassMetadata` 객체를 만듭니다.
4. `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`와 같은 메타데이터 버전을 지정하고, 플래그를 설정합니다(플래그가 없으면 `0`, 필요한 경우 기존 파일에서 플래그 복사).
5. [ASM](https://asm.ow2.io/)의 `ClassWriter` 클래스를 사용하여 `kind`, `data1`, `data2`와 같은 메타데이터 필드를 `.class` 파일에 포함시킵니다.

다음 예제는 단순한 Kotlin 클래스에 대한 메타데이터를 생성하는 방법을 보여줍니다.

```kotlin
// 필요한 라이브러리를 임포트합니다.
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // KmClass 인스턴스를 생성합니다.
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

    // 버전 및 플래그를 포함한 KotlinClassMetadata.Class 인스턴스를 @kotlin.Metadata 어노테이션으로 직렬화합니다.
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // ASM으로 .class 파일을 생성합니다.
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // .class 파일에 @kotlin.Metadata 인스턴스를 씁니다.
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

    // 생성된 .class 파일을 디스크에 씁니다.
    java.io.File("Hello.class").writeBytes(classBytes)

    println("메타데이터 및 .class 파일이 성공적으로 생성되었습니다.")
}
```

> 더 자세한 예제는 [Kotlin Metadata JVM GitHub 리포지토리](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)를 참조하세요.
> 
{style="tip"}

## 다음 단계

* [Kotlin Metadata JVM 라이브러리 API 레퍼런스 보기](https://kotlinlang.org/api/kotlinx-metadata-jvm/)
* [Kotlin Metadata JVM GitHub 리포지토리 확인하기](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)
* [모듈 메타데이터 및 `.kotlin_module` 파일 작업에 대해 알아보기](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)