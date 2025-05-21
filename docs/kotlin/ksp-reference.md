---
title: "Java 注解处理器到 KSP 参考"
---
## 程序元素

| **Java** | **KSP 中最接近的工具** | **备注** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP 不会将包建模为程序元素 |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 类型

KSP 需要显式的类型解析，因此 Java 中的某些功能只能在解析之前通过 `KSType` 和相应的元素来执行。

| **Java** | **KSP 中最接近的工具** | **备注** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | 在 KSP 中不适用 |
| `NullType` | | 在 KSP 中不适用 |
| `PrimitiveType` | `KSBuiltIns` | 与 Java 中的原始类型不完全相同 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin 每个 catch 代码块只有一个类型。即使是 Java 注解处理器也无法观察到 `UnionType` |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 其他

| **Java** | **KSP 中最接近的工具** | **备注** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 一些可以在内置函数中找到，否则检查 `KSClassDeclaration` 的 `DeclaredType` |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSP 中不需要 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | `utils` 的某些部分也集成到符号接口中 |
| `Elements` | `Resolver` / `utils` | |

## 详情

了解 Java 注解处理 API 的功能如何通过 KSP 实现。

### AnnotationMirror

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` 仅适用于 `KSClassDeclaration`。需要提供类型参数。 |
| `getAnnotation` | 待实现 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 类型检查和转换，遵循 `ClassKind` 或 `FunctionKind` |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getDefaultValue` | 待实现 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 检查父声明是否为接口 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP 等效项</b>
</td>
</tr>
<tr>
<td>
`getEnclosedElements`
</td>
<td>
`ksClassDeclaration.declarations`
</td>
</tr>
<tr>
<td>
`getEnclosingElement`
</td>
<td>
`ksClassDeclaration.parentDeclaration`
</td>
</tr>
<tr>
<td>
`getInterfaces`
</td>
<td>

```kotlin
// 应该能够在不进行解析的情况下执行
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```
</td>
</tr>
<tr>
<td>
`getNestingKind`
</td>
<td>
检查 `KSClassDeclaration.parentDeclaration` 和 `inner` 修饰符
</td>
</tr>
<tr>
<td>
`getQualifiedName`
</td>
<td>
`ksClassDeclaration.qualifiedName`
</td>
</tr>
<tr>
<td>
`getSimpleName`
</td>
<td>
`ksClassDeclaration.simpleName`
</td>
</tr>
<tr>
<td>
`getSuperclass`
</td>
<td>

```kotlin
// 应该能够在不进行解析的情况下执行
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```
</td>
</tr>
<tr>
<td>
`getTypeParameters`
</td>
<td>
`ksClassDeclaration.typeParameters`
</td>
</tr>
</table>

### TypeParameterElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getConstantValue` | 待实现 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

:::note
函数的 `KSType` 只是一个由 `FunctionN<R, T1, T2, ..., TN>` 系列表示的签名。

:::

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getKind` | 将 `KSBuiltIns` 中的类型与原始类型、`Unit` 类型进行比较，否则为声明类型 |

### TypeVariable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 待确定。只有在提供捕获并且需要显式边界检查时才需要。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP 等效项</b>
</td>
</tr>
<tr>
<td>
`getExtendsBound`
</td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```
</td>
</tr>
<tr>
<td>
`getSuperBound`
</td>
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
<td>
<b>Java</b>
</td>
<td>
<b>KSP 等效项</b>
</td>
</tr>
<tr>
<td>
`getAllAnnotationMirrors`
</td>
<td>
`KSDeclarations.annotations`
</td>
</tr>
<tr>
<td>
`getAllMembers`
</td>
<td>
`getAllFunctions`, `getAllProperties` 待实现
</td>
</tr>
<tr>
<td>
`getBinaryName`
</td>
<td>
待定，请参阅 <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>
</td>
</tr>
<tr>
<td>
`getConstantExpression`
</td>
<td>
存在常量值，而不是表达式
</td>
</tr>
<tr>
<td>
`getDocComment`
</td>
<td>
待实现
</td>
</tr>
<tr>
<td>
`getElementValuesWithDefaults`
</td>
<td>
待实现
</td>
</tr>
<tr>
<td>
`getName`
</td>
<td>
`resolver.getKSNameFromString`
</td>
</tr>
<tr>
<td>
`getPackageElement`
</td>
<td>
不支持包，但可以检索包信息。KSP 无法对包进行操作
</td>
</tr>
<tr>
<td>
`getPackageOf`
</td>
<td>
不支持包
</td>
</tr>
<tr>
<td>
`getTypeElement`
</td>
<td>
`Resolver.getClassDeclarationByName`
</td>
</tr>
<tr>
<td>
`hides`
</td>
<td>
待实现
</td>
</tr>
<tr>
<td>
`isDeprecated`
</td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```
</td>
</tr>
<tr>
<td>
`overrides`
</td>
<td>
`KSFunctionDeclaration.overrides` / `KSPropertyDeclaration.overrides` (相应类的成员函数)
</td>
</tr>
<tr>
<td>
`printElements`
</td>
<td>
KSP 在大多数类上都有基本的 `toString()` 实现
</td>
</tr>
</table>

### Types

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不需要 |
| `capture` | 待确定 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 根据上下文，`KSType.markNullable` 可能有用 |
| `getPrimitiveType` | 不需要，检查 `KSBuiltins` |
| `getWildcardType` | 在需要 `KSTypeArgument` 的地方使用 `Variance` |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不需要 |