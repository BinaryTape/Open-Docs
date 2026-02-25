[//]: # (title: Java 어노테이션 프로세싱에서 KSP로의 참조 가이드)

## 프로그램 요소 (Program elements)

| **Java** | **KSP에서 가장 가까운 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP는 패키지를 프로그램 요소로 모델링하지 않음 |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 타입 (Types)

KSP는 명시적인 타입 해석(type resolution)이 필요하므로, Java의 일부 기능은 해석 전의 `KSType` 및 해당 요소들을 통해서만 수행될 수 있습니다.

| **Java** | **KSP에서 가장 가까운 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP에서 해당 없음 |
| `NullType` | | KSP에서 해당 없음 |
| `PrimitiveType` | `KSBuiltIns` | Java의 원시 타입(primitive type)과 완전히 동일하지는 않음 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | 해당 없음 | Kotlin은 catch 블록당 하나의 타입만 가짐. `UnionType`은 Java 어노테이션 프로세서에서도 관찰할 수 없음 |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 기타 (Misc)

| **Java** | **KSP에서 가장 가까운 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 일부는 빌트인(builtins)에서 찾을 수 있으며, 그렇지 않으면 `DeclaredType`에 대해 `KSClassDeclaration`을 확인 |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSP에서 필요하지 않음 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | 일부 `utils`는 심볼 인터페이스에 통합됨 |
| `Elements` | `Resolver` / `utils` | |

## 세부 사항 (Details)

Java 어노테이션 프로세싱 API의 기능이 KSP에서 어떻게 수행되는지 확인해 보세요.

### AnnotationMirror

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)`는 `KSClassDeclaration`에서만 사용할 수 있습니다. 타입 인자를 제공해야 합니다. |
| `getAnnotation` | 구현 예정 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | `ClassKind` 또는 `FunctionKind`에 따른 타입 확인 및 캐스팅 |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getDefaultValue` | 구현 예정 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin에서 필요하지 않음 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 부모 선언이 인터페이스인지 여부 확인 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 해당 기능</b></td>
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
// 해석(resolution) 없이 수행할 수 있어야 함
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td><code>KSClassDeclaration.parentDeclaration</code> 및 <code>inner</code> 한정자 확인</td>
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
// 해석(resolution) 없이 수행할 수 있어야 함
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

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getConstantValue` | 구현 예정 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 함수에 대한 `KSType`은 `FunctionN<R, T1, T2, ..., TN>` 계열로 표현되는 시그니처일 뿐입니다.
>
{style="note"}

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin에서 필요하지 않음 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `getKind` | 원시 타입, `Unit` 타입의 경우 `KSBuiltIns`의 타입과 비교하고, 그렇지 않으면 선언된 타입과 비교 |

### TypeVariable

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 결정 예정. 캡처(capture)가 제공되고 명시적인 바운드 검사가 필요한 경우에만 필요함. |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 해당 기능</b></td>
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
        <td><b>KSP 해당 기능</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code> 구현 예정</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>결정 예정, <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java 사양(Specification)</a> 참조</td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>표현식이 아닌 상수 값이 존재함</td>
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
        <td>패키지는 지원되지 않지만, 패키지 정보는 가져올 수 있습니다. KSP에서는 패키지에 대한 작업이 불가능합니다.</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>패키지 지원 안 됨</td>
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
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (각 클래스의 멤버 함수)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP는 대부분의 클래스에 기본 <code>toString()</code> 구현을 가지고 있음</td>
    </tr>
</table>

### 타입 작업 (Types)
{id="type-operations"}

| **Java** | **KSP 해당 기능** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 필요하지 않음 |
| `capture` | 결정 예정 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 컨텍스트에 따라 `KSType.markNullable`이 유용할 수 있음 |
| `getPrimitiveType` | 필요하지 않음, `KSBuiltins` 확인 |
| `getWildcardType` | `KSTypeArgument`가 필요한 곳에 `Variance` 사용 |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 필요하지 않음 |