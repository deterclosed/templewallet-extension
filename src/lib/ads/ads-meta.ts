import { EnvVars } from 'lib/env';

interface AdSourceBase {
  shouldNotUseStrictContainerLimits?: boolean;
}

interface HypeLabBannerAdSource extends AdSourceBase {
  providerName: 'HypeLab';
  native: false;
  size: 'small' | 'high' | 'wide';
}

interface HypeLabNativeAdSource extends AdSourceBase {
  providerName: 'HypeLab';
  native: true;
  slug: string;
}

/** Only covers TKEY ads for now */
interface TempleAdSource extends AdSourceBase {
  providerName: 'Temple';
}

export type PersonaAdShape = 'regular' | 'wide' | 'squarish';

interface PersonaAdSource extends AdSourceBase {
  providerName: 'Persona';
  shape: PersonaAdShape;
}

export type HypeLabAdSources = HypeLabBannerAdSource | HypeLabNativeAdSource;

export type AdSource = HypeLabAdSources | TempleAdSource | PersonaAdSource;

export interface AdDimensions {
  width: number;
  height: number;
  minContainerWidth: number;
  minContainerHeight: number;
  maxContainerWidth: number;
  maxContainerHeight: number;
}

export interface AdMetadata {
  source: AdSource;
  dimensions: AdDimensions;
}

export const BANNER_ADS_META: AdMetadata[] = [
  {
    source: {
      providerName: 'Persona',
      shape: 'wide'
    },
    dimensions: {
      width: 970,
      height: 90,
      minContainerWidth: 600,
      minContainerHeight: 60,
      maxContainerWidth: 1440,
      maxContainerHeight: 110
    }
  },
  {
    source: {
      providerName: 'Temple'
    },
    dimensions: {
      width: 728,
      height: 90,
      minContainerWidth: 600,
      minContainerHeight: 60,
      maxContainerWidth: 1440,
      maxContainerHeight: 110
    }
  },
  {
    source: {
      providerName: 'HypeLab',
      native: false,
      size: 'high'
    },
    dimensions: {
      width: 300,
      height: 250,
      minContainerWidth: 210,
      minContainerHeight: 170,
      maxContainerWidth: 400,
      maxContainerHeight: 300
    }
  },
  {
    source: {
      providerName: 'HypeLab',
      native: false,
      size: 'small',
      shouldNotUseStrictContainerLimits: true
    },
    dimensions: {
      width: 320,
      height: 50,
      minContainerWidth: 230,
      minContainerHeight: 32,
      maxContainerWidth: 420,
      maxContainerHeight: 110
    }
  },
  {
    source: {
      providerName: 'Persona',
      shape: 'regular',
      shouldNotUseStrictContainerLimits: true
    },
    dimensions: {
      width: 321,
      height: 101,
      minContainerWidth: 230,
      minContainerHeight: 32,
      maxContainerWidth: 420,
      maxContainerHeight: 110
    }
  }
];

export const buildHypeLabNativeMeta = (containerWidth: number, containerHeight: number) => ({
  source: {
    providerName: 'HypeLab' as const,
    native: true as const,
    slug: EnvVars.HYPELAB_NATIVE_PLACEMENT_SLUG
  },
  dimensions: {
    width: Math.max(160, containerWidth),
    height: Math.max(16, containerHeight),
    minContainerWidth: 2,
    minContainerHeight: 2,
    maxContainerWidth: Infinity,
    maxContainerHeight: Infinity
  }
});
