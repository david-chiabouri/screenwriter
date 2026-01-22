
import type { Primitive } from "./definitions/type.d.ts";

/**
 * A type representing any class constructor that produces a Primitive.
 * Usage: new (...args) => Primitive
 */
type PrimitiveConstructor<T extends Primitive> = new (...args: any[]) => T;

export class PrimitiveFactory {

    /**
     * DYNAMIC CONSTRUCTOR FACTORY
     * ---------------------------
     * Creates a new instance of a Primitive by passing the class constructor directly.
     * This avoids the need for a central string registry while maintaining full type safety.
     * 
     * @param ctor - The concrete class constructor (e.g. MemoryFaculty).
     * @param args - The arguments required by that specific constructor (automatically inferred).
     * @returns An instance of the specific class passed in.
     */
    public static new<C extends PrimitiveConstructor<Primitive>>(
        ctor: C,
        ...args: ConstructorParameters<C>
    ): InstanceType<C> {
        return new ctor(...args) as InstanceType<C>;
    }
}