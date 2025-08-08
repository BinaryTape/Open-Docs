[//]: # (title: Java 어노테이션 프로세싱에서 KSP 참조로)

## 프로그램 요소

| **Java** | **KSP의 상응하는 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP는 패키지를 프로그램 요소로 모델링하지 않습니다. |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 타입

KSP는 명시적인 타입 해석(type resolution)을 요구하므로, Java의 일부 기능은 `KSType` 및 해석 전의 상응하는 요소들에 의해서만 수행될 수 있습니다.

| **Java** | **KSP의 상응하는 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP에서는 해당 없음 |
| `NullType` | | KSP에서는 해당 없음 |
| `PrimitiveType` | `KSBuiltIns` | Java의 primitive 타입과 정확히 같지는 않습니다. |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin은 catch 블록당 하나의 타입만 가집니다. `UnionType`은 Java 어노테이션 프로세서로도 관찰할 수 없습니다. |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 기타

| **Java** | **KSP의 상응하는 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` | | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` | | |
| `TypeKind` | `KSBuiltIns` | 일부는 빌트인(built-in)에서 찾을 수 있으며, 그렇지 않으면 `DeclaredType`에 대해 `KSClassDeclaration`을 확인하십시오. |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` | | KSP에서는 필요하지 않습니다. |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` | | |
| `TypeKindVisitor` | | |
| `Types` | `Resolver` / `utils` | 일부 유틸리티(utils)는 심볼 인터페이스에 통합되어 있습니다. |
| `Elements` | `Resolver` / `utils` | |

## 상세 내용

Java 어노테이션 프로세싱 API의 기능들이 KSP에 의해 어떻게 수행될 수 있는지 확인하십시오.

### AnnotationMirror

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)`는 `KSClassDeclaration`에만 사용 가능합니다. 타입 인자(type arguments)를 제공해야 합니다. |
| `getAnnotation` | 구현 예정 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | `ClassKind` 또는 `FunctionKind`에 따라 타입 검사 및 캐스팅(casting)을 수행합니다. |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getDefaultValue` | 구현 예정 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin에서는 필요하지 않습니다. |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 부모 선언(parent declaration)이 인터페이스인지 확인합니다. |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 상응 항목</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 해석(resolution) 없이도 수행할 수 있어야 합니다.
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td><code>KSClassDeclaration.parentDeclaration</code> 및 <code>inner</code> 변경자(modifier)를 확인합니다.</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 해석(resolution) 없이도 수행할 수 있어야 합니다.
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getConstantValue` | 구현 예정 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 함수에 대한 `KSType`은 `FunctionN<R, T1, T2, ..., TN>` 계열로 표현되는 시그니처(signature)일 뿐입니다.
>
{style="note"}

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin에서는 필요하지 않습니다. |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `getKind` | primitive 타입 및 `Unit` 타입에 대해서는 `KSBuiltIns`의 타입과 비교하고, 그렇지 않으면 선언된 타입(declared types)을 확인합니다. |

### TypeVariable

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 미정. 캡처(capture)가 제공되고 명시적인 바운드(bound) 검사가 필요한 경우에만 필요합니다. |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 상응 항목</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 상응 항목</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code>는 구현 예정입니다.</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>미정, <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>을 참조하십시오.</td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>상수 값(constant value)은 있지만 표현식(expression)은 없습니다.</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>패키지는 지원되지 않지만, 패키지 정보를 검색할 수는 있습니다. KSP에서는 패키지에 대한 작업이 불가능합니다.</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>패키지는 지원되지 않습니다.</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (해당 클래스의 멤버 함수)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP는 대부분의 클래스에 기본 <code>toString()</code> 구현을 가지고 있습니다.</td>
    </tr>
</table>

### Types
{id="type-operations"}

| **Java** | **KSP 상응 항목** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 필요하지 않습니다. |
| `capture` | 미정 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 컨텍스트(context)에 따라 `KSType.markNullable`이 유용할 수 있습니다. |
| `getPrimitiveType` | 필요하지 않습니다. `KSBuiltins`를 확인하십시오. |
| `getWildcardType` | `KSTypeArgument`를 예상하는 곳에서는 `Variance`를 사용하십시오. |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 필요하지 않습니다. |